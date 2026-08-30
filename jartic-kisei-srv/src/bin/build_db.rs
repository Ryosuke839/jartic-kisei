//! Rebuild `kisei.db` from JARTIC type-D CSVs.
//!
//! Usage (from `jartic-kisei-srv/`):
//!   cargo run --release --bin build_db -- [DB_PATH] [CSV_GLOB]
//!
//! Defaults: `../kisei.db` and `../data/*_202502_k_2.1.csv`
//!
//! k_2.1 rows are mapped onto the original 224-column layout that the API and
//! client still read (`row[10]` = type, `row[17]` = coords, periods at 46..136).

use std::collections::HashSet;
use std::error::Error;
use std::fs::File;
use std::path::Path;

use encoding_rs::SHIFT_JIS;
use encoding_rs_io::DecodeReaderBytesBuilder;

type Result<T> = std::result::Result<T, Box<dyn Error>>;

struct Coord {
    lat: f64,
    lng: f64,
}

impl Coord {
    fn to_le_bytes(&self) -> [u8; 16] {
        let mut bytes = [0u8; 16];
        bytes[..8].copy_from_slice(&self.lat.to_le_bytes());
        bytes[8..16].copy_from_slice(&self.lng.to_le_bytes());
        bytes
    }
}

fn field(row: &[String], i: usize) -> &str {
    row.get(i).map(String::as_str).unwrap_or("")
}

fn js_number(s: Option<&str>) -> f64 {
    match s {
        None => f64::NAN,
        Some("") => 0.0,
        Some(s) => s.parse().unwrap_or(f64::NAN),
    }
}

fn get_distance(a: &Coord, b: &Coord) -> f64 {
    let dlat = b.lat - a.lat;
    let dlng = b.lng - a.lng;
    (dlat * dlat + dlng * dlng * 0.64).sqrt()
}

fn parse_coords(s: &str) -> Vec<Coord> {
    s.split(&[';', '/'][..])
        .map(|part| {
            let mut parts = part.split(' ');
            Coord {
                lng: js_number(parts.next()),
                lat: js_number(parts.next()),
            }
        })
        .collect()
}

fn should_skip(row: &[String]) -> bool {
    let unique_key = field(row, 20);
    let tokyo_skip = unique_key == "08202606011675400000000000101933" || unique_key == "08202606001967400000000000013227";
    tokyo_skip
}

struct PreparedKisei {
    id: String,
    row: String,
    coords: Vec<u8>,
    offsets: Vec<u8>,
    len: i64,
    minlat: f64,
    maxlat: f64,
    minlng: f64,
    maxlng: f64,
}

fn prepare_kisei(row: &[String]) -> Option<PreparedKisei> {
    let coords = parse_coords(field(row, 23));
    if coords.is_empty() {
        return None;
    }
    let mut offsets: Vec<f64> = coords
        .iter()
        .enumerate()
        .map(|(i, coord)| {
            if i == 0 {
                0.0
            } else {
                get_distance(coord, &coords[i - 1])
            }
        })
        .collect();
    if !offsets.iter().all(|l| *l < 0.1) {
        return None;
    }
    for i in 1..offsets.len() {
        offsets[i] += offsets[i - 1];
    }

    let mut minlat = coords[0].lat;
    let mut maxlat = coords[0].lat;
    let mut minlng = coords[0].lng;
    let mut maxlng = coords[0].lng;
    for coord in &coords {
        minlat = minlat.min(coord.lat);
        maxlat = maxlat.max(coord.lat);
        minlng = minlng.min(coord.lng);
        maxlng = maxlng.max(coord.lng);
    }
    if ![minlat, maxlat, minlng, maxlng]
        .into_iter()
        .all(f64::is_finite)
    {
        return None;
    }

    let id = field(row, 20).to_string();

    Some(PreparedKisei {
        id,
        row: row.iter().enumerate().map(|(i, s)| if i == 23 { "".to_string() } else { s.clone() }).collect::<Vec<_>>().join("\n"),
        coords: coords
            .iter()
            .map(|c| c.to_le_bytes())
            .flatten()
            .collect(),
        offsets: offsets
            .iter()
            .map(|n| n.to_le_bytes())
            .flatten()
            .collect(),
        len: coords.len() as i64,
        minlat,
        maxlat,
        minlng,
        maxlng,
    })
}

fn open_csv(path: &Path) -> Result<csv::Reader<impl std::io::Read>> {
    let file = File::open(path)?;
    let transcoded = DecodeReaderBytesBuilder::new()
        .encoding(Some(SHIFT_JIS))
        .build(file);
    Ok(csv::ReaderBuilder::new()
        .has_headers(true)
        .flexible(true)
        .from_reader(transcoded))
}

fn main() -> Result<()> {
    let mut args = std::env::args().skip(1);
    let db_path = args.next().unwrap_or_else(|| "../kisei.db".to_string());
    let pattern = args
        .next()
        .unwrap_or_else(|| "../data/*_202502_k_2.1.csv".to_string());

    let mut files: Vec<_> = glob::glob(&pattern)?.filter_map(|p| p.ok()).collect();
    files.sort();
    if files.is_empty() {
        return Err(format!("no CSV files matched {pattern}").into());
    }

    let con = rusqlite::Connection::open(&db_path)?;
    con.execute_batch(
        "PRAGMA journal_mode = WAL;
         PRAGMA synchronous = OFF;
         DROP TABLE IF EXISTS kiseis;
         CREATE VIRTUAL TABLE IF NOT EXISTS kiseis USING rtree(
           pk, minlat, maxlat, minlng, maxlng,
           +id CHAR(32), +row TEXT, +coords BLOB, +offsets BLOB, +len INTEGER
         );
         BEGIN;",
    )?;

    let mut stmt = con.prepare(
        "INSERT INTO kiseis(pk, id, row, coords, offsets, len, minlat, maxlat, minlng, maxlng)
         VALUES(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
    )?;

    let mut kisei_ids = HashSet::new();
    let mut pk: i64 = 0;
    let mut inserted = 0usize;
    let total_files = files.len();

    for (file_i, file) in files.iter().enumerate() {
        println!("loading from {}", file.display());
        let mut rdr = open_csv(file)?;
        for rec in rdr.records() {
            let rec = rec?;
            let row: Vec<String> = rec.iter().map(|s| s.to_string()).collect();
            if should_skip(&row) {
                continue;
            }
            let Some(prepared) = prepare_kisei(&row) else {
                continue;
            };
            if !kisei_ids.insert(prepared.id.clone()) {
                continue;
            }
            stmt.execute(rusqlite::params![
                pk,
                prepared.id,
                prepared.row,
                prepared.coords,
                prepared.offsets,
                prepared.len,
                prepared.minlat,
                prepared.maxlat,
                prepared.minlng,
                prepared.maxlng,
            ])?;
            pk += 1;
            inserted += 1;
        }
        println!("{}/{} {} ready.", file_i + 1, total_files, file.display());
    }

    drop(stmt);
    con.execute_batch("COMMIT;")?;
    println!("inserted {inserted} rows into {db_path}");
    println!("done.");
    Ok(())
}
