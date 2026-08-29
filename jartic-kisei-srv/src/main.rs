use actix_files::NamedFile;
use actix_web::{web, App, Error, HttpResponse, HttpServer, middleware};
use serde::{Deserialize, Serialize};
use bytes::Bytes;
use std::sync::Mutex;
use std::task::{Context, Poll};
use std::pin::Pin;
use futures::stream::Stream;

struct AABB {
    minlat: f32,
    maxlat: f32,
    minlng: f32,
    maxlng: f32,
}

impl AABB {
    fn is_zero(&self) -> bool {
        self.minlat == 0.0 && self.maxlat == 0.0 && self.minlng == 0.0 && self.maxlng == 0.0
    }
    fn intersects(&self, other: &AABB) -> bool {
        !self.is_zero() && f32::max(other.minlat, self.minlat) <= f32::min(other.maxlat, self.maxlat) && f32::max(other.minlng, self.minlng) <= f32::min(other.maxlng, self.maxlng)
    }
    fn overlaps(&self, other: &AABB) -> bool {
        !self.is_zero() && self.minlat == other.minlat && self.maxlat == other.maxlat && self.minlng == other.minlng && self.maxlng == other.maxlng
    }
    fn union(&mut self, other: &AABB) {
        if self.is_zero() {
            self.minlat = other.minlat;
            self.maxlat = other.maxlat;
            self.minlng = other.minlng;
            self.maxlng = other.maxlng;
        }
        self.minlat = f32::min(self.minlat, other.minlat);
        self.maxlat = f32::max(self.maxlat, other.maxlat);
        self.minlng = f32::min(self.minlng, other.minlng);
        self.maxlng = f32::max(self.maxlng, other.maxlng);
    }
    fn area(&self) -> f32 {
        (self.maxlat - self.minlat) * (self.maxlng - self.minlng) * 0.64
    }
    fn zeros() -> AABB {
        AABB {
            minlat: 0.0,
            maxlat: 0.0,
            minlng: 0.0,
            maxlng: 0.0,
        }
    }
}

fn open_db() -> rusqlite::Result<rusqlite::Connection> {
    rusqlite::Connection::open_with_flags(
        "./../kisei.db",
        rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX,
    )
}

fn get_text_lossy(row: &rusqlite::Row, idx: usize) -> rusqlite::Result<String> {
    Ok(match row.get_ref(idx)? {
        rusqlite::types::ValueRef::Text(bytes) | rusqlite::types::ValueRef::Blob(bytes) => {
            String::from_utf8_lossy(bytes).into_owned()
        }
        rusqlite::types::ValueRef::Null => String::new(),
        _ => String::new(),
    })
}

fn parse_coords(s: &str) -> Vec<Coord> {
    s.split('"').filter_map(|part| {
        let mut parts = part.split_whitespace();
        let lng = parts.next()?.parse().ok()?;
        let lat = parts.next()?.parse().ok()?;
        Some(Coord { lat, lng })
    }).collect()
}

fn parse_offsets(s: &str) -> Vec<f64> {
    s.lines().filter_map(|line| line.parse().ok()).collect()
}

fn is_finite_aabb(aabb: &AABB) -> bool {
    aabb.minlat.is_finite() && aabb.maxlat.is_finite() && aabb.minlng.is_finite() && aabb.maxlng.is_finite()
}

#[derive(Debug, Serialize)]
struct Coord {
    lat: f64,
    lng: f64,
}

struct KiseiRow {
    id: String,
    row: String,
    offsets: String,
    last: bool,
}

#[derive(Debug, Serialize)]
struct APIResult {
    id: String,
    row: Option<Vec<String>>,
    coords: Option<Vec<Coord>>,
    offsets: Option<Vec<f64>>,
}

struct LazyAPIResults {
    rows: Vec<KiseiRow>,
    index: usize,
    finished: bool,
}

impl Stream for LazyAPIResults {
    type Item = Result<Bytes, Error>;

    fn poll_next(self: Pin<&mut Self>, _: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        let this = self.get_mut();

        if this.finished {
            return Poll::Ready(None);
        }
        match this.rows.get(this.index) {
            Some(row) => {
                let json = {
                    if row.last {
                        APIResult {
                            id: row.id.clone(),
                            row: None,
                            coords: None,
                            offsets: None,
                        }
                    } else {
                        let mut r = row.row.lines().map(|s| s.to_owned()).collect::<Vec<_>>();
                        let coords = r.get(17).map(|s| parse_coords(s)).unwrap_or_default();
                        if let Some(cell) = r.get_mut(17) {
                            cell.clear();
                        }
                        APIResult {
                            id: row.id.clone(),
                            row: Some(r),
                            coords: Some(coords),
                            offsets: Some(parse_offsets(&row.offsets)),
                        }
                    }
                };
                let res = serde_json::to_string(&json).unwrap_or_else(|_| "null".to_owned());
                let res = if this.index == 0 {
                    format!("[{}", res)
                } else {
                    format!(",{}", res)
                };
                this.index += 1;
                Poll::Ready(Some(Ok(Bytes::from(res))))
            }
            None => {
                this.finished = true;
                Poll::Ready(Some(Ok(Bytes::from(if this.index == 0 { "[]" } else { "]" }))))
            }
        }
    }
}

fn api(aabb_query: AABBQuery, con: &rusqlite::Connection) -> rusqlite::Result<Option<LazyAPIResults>> {
    let (aabb, last_aabb_opt) = aabb_query.inner();
    if !is_finite_aabb(&aabb) {
        return Ok(Some(LazyAPIResults {
            rows: vec![],
            index: 0,
            finished: false,
        }));
    }
    let last_aabb = last_aabb_opt.filter(is_finite_aabb).unwrap_or_else(AABB::zeros);

    let mut stmt = con.prepare(
        "SELECT COALESCE(SUM(len), 0) FROM kiseis WHERE ?1<=maxlat AND minlat<=?2 AND ?3<=maxlng AND minlng<=?4",
    )?;
    let len: i64 = stmt.query_row(
        rusqlite::params![aabb.minlat as f64, aabb.maxlat as f64, aabb.minlng as f64, aabb.maxlng as f64],
        |row| row.get(0),
    )?;
    if len > 65536 {
        return Ok(None);
    }
    if len == 0 {
        return Ok(Some(LazyAPIResults {
            rows: vec![],
            index: 0,
            finished: false,
        }));
    }

    let mut stmt = con.prepare(
        "SELECT id, row, offsets, (?1<=maxlat AND minlat<=?2 AND ?3<=maxlng AND minlng<=?4) AS last \
         FROM kiseis WHERE ?5<=maxlat AND minlat<=?6 AND ?7<=maxlng AND minlng<=?8",
    )?;
    let rows = stmt.query_map(
        rusqlite::params![
            last_aabb.minlat as f64,
            last_aabb.maxlat as f64,
            last_aabb.minlng as f64,
            last_aabb.maxlng as f64,
            aabb.minlat as f64,
            aabb.maxlat as f64,
            aabb.minlng as f64,
            aabb.maxlng as f64,
        ],
        |row| {
            Ok(KiseiRow {
                id: get_text_lossy(row, 0)?,
                row: get_text_lossy(row, 1)?,
                offsets: get_text_lossy(row, 2)?,
                last: row.get(3).unwrap_or(false),
            })
        },
    )?.filter_map(|r| r.map_err(|e| eprintln!("row error: {e}")).ok()).collect();

    Ok(Some(LazyAPIResults {
        rows,
        index: 0,
        finished: false,
    }))
}

async fn get_index() -> actix_web::Result<NamedFile> {
    Ok(NamedFile::open("../dist/index.html")?)
}

async fn get_app() -> actix_web::Result<NamedFile> {
    Ok(NamedFile::open("../dist/app.js")?)
}

async fn get_sign(info: web::Path<String>) -> actix_web::Result<NamedFile> {
    Ok(NamedFile::open(format!("../dist/signs/{}", info.into_inner()))?)
}

#[derive(Deserialize)]
struct AABBQuery {
    minlat: f32,
    maxlat: f32,
    minlng: f32,
    maxlng: f32,
    last_minlat: Option<f32>,
    last_maxlat: Option<f32>,
    last_minlng: Option<f32>,
    last_maxlng: Option<f32>,
}

impl AABBQuery {
    fn inner(&self) -> (AABB, Option<AABB>) {
        (
            AABB {
                minlat: self.minlat,
                maxlat: self.maxlat,
                minlng: self.minlng,
                maxlng: self.maxlng,
            },
            if let Some(last_minlat) = self.last_minlat {
                if let Some(last_maxlat) = self.last_maxlat {
                    if let Some(last_minlng) = self.last_minlng {
                        if let Some(last_maxlng) = self.last_maxlng {
                            Some(AABB {
                                minlat: last_minlat,
                                maxlat: last_maxlat,
                                minlng: last_minlng,
                                maxlng: last_maxlng,
                            })
                        } else { None }
                    } else { None }
                } else { None }
            } else { None },
        )
    }
}

async fn get_api(info: web::Query<AABBQuery>, db: web::Data<Mutex<rusqlite::Connection>>) -> impl actix_web::Responder {
    let con = match db.lock() {
        Ok(con) => con,
        Err(poisoned) => poisoned.into_inner(),
    };
    match api(info.into_inner(), &con) {
        Ok(Some(res)) => HttpResponse::Ok()
            .content_type("application/json")
            .streaming(res),
        Ok(None) => HttpResponse::TooManyRequests().finish(),
        Err(e) => {
            eprintln!("api error: {e}");
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("ready.");
    HttpServer::new(|| {
        let con = open_db().expect("failed to open kisei.db");
        App::new()
            .app_data(web::Data::new(Mutex::new(con)))
            .wrap(middleware::Compress::default())
            .service(web::resource("/").to(get_index))
            .service(web::resource("/@{coord:.*}").to(get_index))
            .service(web::resource("/app.js").to(get_app))
            .service(web::resource("/signs/{name}").to(get_sign))
            .service(web::resource("/api").to(get_api))
    })
        .bind(("0.0.0.0", 3000))?
        .run()
        .await
}
