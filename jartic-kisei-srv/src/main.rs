use actix_files::NamedFile;
use actix_web::{web, App, HttpResponse, HttpServer, middleware};
use serde::{Deserialize, Serialize};
use derive_getters::Getters;

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

#[derive(Getters)]
struct Singleton {
    con: rusqlite::Connection,
}

fn singleton() -> Result<&'static Singleton, rusqlite::Error> {
    static mut CON: Option<rusqlite::Connection> = None;
    static mut SINGLETON: Option<Singleton> = None;

    unsafe {
        if SINGLETON.is_none() {
            if CON.is_none() {
                println!("  opening...");
                CON = Some(rusqlite::Connection::open_with_flags("./../kisei.db", rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX)?);
            }
            SINGLETON = Some(Singleton {
                con: CON.take().unwrap(),
            })
        }
        Ok(SINGLETON.as_ref().unwrap())
    }
}

#[derive(Debug, Serialize)]
struct Coord {
    lat: f64,
    lng: f64,
}

#[derive(Debug, Serialize)]
struct APIResult {
    id: String,
    row: Option<Vec<String>>,
    coords: Option<Vec<Coord>>,
    offsets: Option<Vec<f64>>,
}

fn api(aabb_query: AABBQuery) -> Option<Vec<APIResult>> {
    let (aabb, last_aabb_opt) = aabb_query.inner();
    let last_aabb = last_aabb_opt.unwrap_or(AABB::zeros());
    let singleton = singleton().unwrap();
    let con = singleton.con();
    let mut stmt = con.prepare(format!("select sum(len) from kiseis where ({}<=maxlat and minlat<={} and {}<=maxlng and minlng<={});", aabb.minlat, aabb.maxlat, aabb.minlng, aabb.maxlng).as_str()).unwrap();
    let len = stmt.query_and_then::<_, rusqlite::Error, _, _>(rusqlite::params![], |row| {
        Ok(row.get::<_, isize>(0).unwrap())
    }).unwrap().next().unwrap().unwrap();
    if len > 65536 {
        return None;
    }
    if len == 0 {
        return Some(vec![]);
    }
    let result: Vec<APIResult> = {
        let mut stmt = con.prepare(format!("select id, row, offsets, {}<=maxlat and minlat<={} and {}<=maxlng and minlng<={} as last from kiseis where {}<=maxlat and minlat<={} and {}<=maxlng and minlng<={};", last_aabb.minlat, last_aabb.maxlat, last_aabb.minlng, last_aabb.maxlng, aabb.minlat, aabb.maxlat, aabb.minlng, aabb.maxlng).as_str()).unwrap();
        stmt.query_and_then::<_, rusqlite::Error, _, _>(rusqlite::params![], |row| {
            if row.get::<_, bool>(3).unwrap() {
                return Ok(APIResult {
                    id: row.get(0).unwrap(),
                    row: None,
                    coords: None,
                    offsets: None,
                });
            }
            let mut r = row.get::<_, String>(1).unwrap().lines().map(|r| r.to_owned()).collect::<Vec<_>>();
            let coords = r[17].split('"').map(|s| {
                let sp = s.split(' ');
                Coord { lat: sp.clone().nth(1).unwrap().parse::<f64>().unwrap(), lng: sp.clone().nth(0).unwrap().parse::<f64>().unwrap() }
            }).collect::<Vec<_>>();
            r[17] = "".to_owned();
            Ok(APIResult {
                id: row.get(0).unwrap(),
                row: Some(r),
                coords: Some(coords),
                offsets: Some(row.get::<_, String>(2).unwrap().lines().map(|s| s.parse::<f64>().unwrap()).collect()),
            })
        }).unwrap().map(|r| r.unwrap()).collect()
        // thread 'actix-rt|system:0|arbiter:2' panicked at 'called `Result::unwrap()` on an `Err` value: SqliteFailure(Error { code: DatabaseCorrupt, extended_code: 11 }, Some("database disk image is malformed"))', src/main.rs:364:31
    };
    Some(result)
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

async fn get_api(info: web::Query<AABBQuery>) -> impl actix_web::Responder {
    match api(info.into_inner()) {
        Some(res) => HttpResponse::Ok().json(res),
        None => HttpResponse::TooManyRequests().finish(),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("ready.");
    HttpServer::new(|| App::new()
        .wrap(middleware::Compress::default())
        .service(web::resource("/").to(get_index))
        .service(web::resource("/@{coord:.*}").to(get_index))
        .service(web::resource("/app.js").to(get_app))
        .service(web::resource("/signs/{name}").to(get_sign))
        .service(web::resource("/api").to(get_api)))
        .bind(("0.0.0.0", 3000))?
        .run()
        .await
}
