use actix_files::NamedFile;
use actix_web::{web, App, HttpResponse, HttpServer, middleware};
use serde::{Deserialize, Serialize};
use derive_getters::Getters;
use std::collections::HashSet;
use crossbeam;

struct AABB {
    minlat: f32,
    maxlat: f32,
    minlng: f32,
    maxlng: f32,
}

struct DBRow {
    id: u128,
    len: isize,
    aabb: AABB,
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

struct AABBTree<'tree> {
    aabb: AABB,
    children: Option<Box<[AABBTree<'tree>; 2]>>,
    range: &'tree [DBRow],
    len: isize,
}

impl AABBTree<'_> {
    fn find(&self, aabb: &AABB, limit: &mut isize) -> Vec<&DBRow> {
        if !self.aabb.intersects(&aabb) {
            return vec![];
        }
        if let Some(children) = self.children.as_deref() {
            if !(self.aabb.minlat >= aabb.minlat && self.aabb.maxlat <= aabb.maxlat && self.aabb.minlng >= aabb.minlng && self.aabb.maxlng <= aabb.maxlng) {
                let res = children.iter().map(|c| c.find(aabb, limit)).flatten().collect();
                return if *limit < 0 { vec![] } else { res }
            }
        }
        *limit -= self.len;
        if *limit < 0isize {
            vec![]
        } else {
            self.range.iter().collect()
        }
    }
}

struct PartitionPoint {
    mid: usize,
    children: Box<[PartitionPoints; 2]>,
}

type PartitionPoints = Option<PartitionPoint>;

fn sort_rows(rows: &mut [DBRow], depth: usize) -> PartitionPoints {
    assert!(format!("{:b}", rows.len()).to_string().len() + depth < 64);
    if rows.iter().all(|r| rows[0].aabb.overlaps(&r.aabb)) {
        return None;
    }
    let (mut rows_north, mut rows_south, mut rows_east, mut rows_west) = if depth < 2 {
        crossbeam::thread::scope(|s| {
            let rows_north = s.spawn(|_| {
                let mut rows_north: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
                rows_north.sort_by(|a, b| f32::partial_cmp(&b.unwrap().aabb.minlat, &a.unwrap().aabb.minlat).unwrap());
                rows_north
            });
            let rows_south = s.spawn(|_| {
                let mut rows_south: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
                rows_south.sort_by(|a, b| f32::partial_cmp(&a.unwrap().aabb.maxlat, &b.unwrap().aabb.maxlat).unwrap());
                rows_south
            });
            let rows_east = s.spawn(|_| {
                let mut rows_east: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
                rows_east.sort_by(|a, b| f32::partial_cmp(&b.unwrap().aabb.minlng, &a.unwrap().aabb.minlng).unwrap());
                rows_east
            });
            let rows_west = s.spawn(|_| {
                let mut rows_west: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
                rows_west.sort_by(|a, b| f32::partial_cmp(&a.unwrap().aabb.maxlng, &b.unwrap().aabb.maxlng).unwrap());
                rows_west
            });
            (rows_north.join().unwrap(), rows_south.join().unwrap(), rows_east.join().unwrap(), rows_west.join().unwrap())
        }).unwrap()
    } else {
        let mut rows_north: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
        rows_north.sort_by(|a, b| f32::partial_cmp(&b.unwrap().aabb.minlat, &a.unwrap().aabb.minlat).unwrap());
        let mut rows_south: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
        rows_south.sort_by(|a, b| f32::partial_cmp(&a.unwrap().aabb.maxlat, &b.unwrap().aabb.maxlat).unwrap());
        let mut rows_east: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
        rows_east.sort_by(|a, b| f32::partial_cmp(&b.unwrap().aabb.minlng, &a.unwrap().aabb.minlng).unwrap());
        let mut rows_west: Vec<Option<&DBRow>> = rows.iter().map(|r| Some(r)).collect();
        rows_west.sort_by(|a, b| f32::partial_cmp(&a.unwrap().aabb.maxlng, &b.unwrap().aabb.maxlng).unwrap());
        (rows_north, rows_south, rows_east, rows_west)
    };
    let mut aabb_north = AABB::zeros();
    let mut aabb_south = AABB::zeros();
    let mut i_north = 0usize;
    {
        let mut i_south = 0usize;
        let mut set_lat = HashSet::new();
        while set_lat.len() < rows.len() {
            while i_north < rows.len() {
                if let Some(next) = rows_north[i_north] {
                    if !set_lat.contains(&next.id) {
                        aabb_north.union(&next.aabb);
                        set_lat.insert(next.id);
                        break;
                    } else {
                        rows_north[i_north] = None;
                    }
                    i_north += 1;
                }
            }
            i_north += 1;
            while i_south < rows.len() {
                if let Some(next) = rows_south[i_south] {
                    if !set_lat.contains(&next.id) {
                        aabb_south.union(&next.aabb);
                        set_lat.insert(next.id);
                        break;
                    } else {
                        rows_south[i_south] = None;
                    }
                    i_south += 1;
                }
            }
            i_south += 1;
        }
    }
    let mut aabb_east = AABB::zeros();
    let mut aabb_west = AABB::zeros();
    let mut i_east = 0usize;
    {
        let mut i_west = 0usize;
        let mut set_lng = HashSet::new();
        while set_lng.len() < rows.len() {
            while i_east < rows.len() {
                if let Some(next) = rows_east[i_east] {
                    if !set_lng.contains(&next.id) {
                        aabb_east.union(&next.aabb);
                        set_lng.insert(next.id);
                        break;
                    } else {
                        rows_east[i_east] = None;
                    }
                    i_east += 1;
                }
            }
            i_east += 1;
            while i_west < rows.len() {
                if let Some(next) = rows_west[i_west] {
                    if !set_lng.contains(&next.id) {
                        aabb_west.union(&next.aabb);
                        set_lng.insert(next.id);
                        break;
                    } else {
                        rows_west[i_west] = None;
                    }
                    i_west += 1;
                }
            }
            i_west += 1;
        }
    }
    let prefer_lat = aabb_north.area() + aabb_south.area() < aabb_east.area() + aabb_west.area();
    let set_left = if prefer_lat { rows_north[..i_north].iter() } else { rows_east[..i_east].iter() }.flatten().map(|r| r.id).collect::<HashSet<u128>>();
    rows.sort_by_key(|r| set_left.contains(&r.id));
    let (rows_left, rows_right) = rows.split_at_mut(set_left.len());
    let (left, right) = if depth < 4 {
        crossbeam::thread::scope(|s| {
            let left = s.spawn(|_| {
                sort_rows(rows_left, depth + 1)
            });
            let right = s.spawn(|_| {
                sort_rows(rows_right, depth + 1)
            });
            (left.join().unwrap(), right.join().unwrap())
        }).unwrap()
    } else {
        let left = sort_rows(rows_left, depth + 1);
        let right = sort_rows(rows_right, depth + 1);
        (left, right)
    };
    Some(PartitionPoint { 
        mid: set_left.len(),
        children: Box::new([left, right]),
    })
}

fn build_tree<'tree>(rows: &'tree [DBRow], partition_points: &PartitionPoints, depth: usize) -> AABBTree<'tree> {
    if let Some(pp) = partition_points {
        let (rows_left, rows_right) = rows.split_at(pp.mid);
        let (left, right) = if depth < 4 {
            crossbeam::thread::scope(|s| {
                let left = s.spawn(|_| {
                    build_tree(rows_left, &pp.children[0], depth + 1)
                });
                let right = s.spawn(|_| {
                    build_tree(rows_right, &pp.children[1], depth + 1)
                });
                (left.join().unwrap(), right.join().unwrap())
            }).unwrap()
        } else {
            let left = build_tree(rows_left, &pp.children[0], depth + 1);
            let right = build_tree(rows_right, &pp.children[1], depth + 1);
            (left, right)
        };
        let mut aabb = AABB::zeros();
        aabb.union(&left.aabb);
        aabb.union(&right.aabb);
        AABBTree {
            aabb: aabb,
            len: left.len + right.len,
            children: Some(Box::new([left, right])),
            range: rows,
        }
    } else {
        let mut aabb = AABB::zeros();
        rows.iter().for_each(|r| aabb.union(&r.aabb));
        return AABBTree {
            aabb: aabb,
            children: None,
            range: rows,
            len: rows.iter().map(|r| r.len).sum(),
        };
    }
}

#[derive(Getters)]
struct Singleton<'singleton> {
    con: rusqlite::Connection,
    rows: Vec<DBRow>,
    aabb_tree: AABBTree<'singleton>,
}

fn singleton() -> Result<&'static Singleton<'static>, rusqlite::Error> {
    static mut CON: Option<rusqlite::Connection> = None;
    static mut ROWS: Option<Vec<DBRow>> = None;
    static mut AABB_TREE: Option<AABBTree> = None;
    static mut SINGLETON: Option<Singleton> = None;

    unsafe {
        if SINGLETON.is_none() {
            if CON.is_none() {
                println!("  opening...");
                CON = Some(rusqlite::Connection::open_with_flags("./../kisei.db", rusqlite::OpenFlags::SQLITE_OPEN_READ_ONLY | rusqlite::OpenFlags::SQLITE_OPEN_NO_MUTEX)?);
            }
            if ROWS.is_none() {
                println!("  reading...");
                if let Some(con_some) = &CON {
                    let mut stmt = con_some.prepare("select id, offsets, minlat, maxlat, minlng, maxlng from kiseis;")?;
                    ROWS = Some(stmt.query_and_then::<_, rusqlite::Error, _, _>(rusqlite::params![], |row| {
                        Ok(DBRow {
                            id: u128::from_str_radix(row.get::<_, String>(0)?.as_str(), 16).unwrap(),
                            len: isize::max((row.get::<_, String>(1)?.lines().last().unwrap().parse::<f64>().unwrap() / 0.002828) as isize, 1) + 3,
                            aabb: AABB {
                                minlat: row.get(2)?,
                                maxlat: row.get(3)?,
                                minlng: row.get(4)?,
                                maxlng: row.get(5)?,
                            }
                        })
                    })?.map(|r| r.unwrap()).collect::<Vec<DBRow>>());
                }
            }
            if AABB_TREE.is_none() {
                println!("  sorting...");
                if let Some(ref mut rows_some) = ROWS {
                    let partition_points = sort_rows(rows_some.as_mut_slice(), 0);
                    println!("  building...");
                    AABB_TREE = Some(build_tree(rows_some.as_slice(), &partition_points, 0));
                }
                println!("  built.");
            }
            SINGLETON = Some(Singleton {
                con: CON.take().unwrap(),
                rows: ROWS.take().unwrap(),
                aabb_tree: AABB_TREE.take().unwrap(),
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
    let mut len = 16384;
    let rows = singleton.aabb_tree().find(&aabb, &mut len);
    if len < 0 {
        return None;
    }
    if rows.is_empty() {
        return Some(vec![]);
    }
    let rows_query = rows.iter().filter(|r| !last_aabb.intersects(&r.aabb));
    let rows_skip = rows.iter().filter(|r| last_aabb.intersects(&r.aabb));
    let mut result = if rows_query.clone().count() > 0 {
        let con = singleton.con();
        let mut stmt = con.prepare(format!("select id, row, offsets from kiseis where id in ({});", rows_query.map(|r| format!("\"{:032x}\"", r.id)).collect::<Vec<String>>().join(", ")).as_str()).unwrap();
        stmt.query_and_then::<_, rusqlite::Error, _, _>(rusqlite::params![], |row| {
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
    } else {
        vec![]
    };
    result.extend(rows_skip.map(|r| APIResult {
        id: format!("{:032x}", r.id),
        row: None,
        coords: None,
        offsets: None,
    }));
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
    println!("initializing...");
    println!("ready. {} elements.", singleton().unwrap().aabb_tree().len);
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
