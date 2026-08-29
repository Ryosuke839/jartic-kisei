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

const OLD_NCOLS: usize = 224;

type Result<T> = std::result::Result<T, Box<dyn Error>>;

struct Coord {
    lat: f64,
    lng: f64,
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

fn pad_start_4(s: &str) -> String {
    format!("{s:0>4}")
}

fn get_distance(a: &Coord, b: &Coord) -> f64 {
    let dlat = b.lat - a.lat;
    let dlng = b.lng - a.lng;
    (dlat * dlat + dlng * dlng * 0.64).sqrt()
}

fn parse_coords(s: &str) -> Vec<Coord> {
    s.split('"')
        .map(|part| {
            let mut parts = part.split(' ');
            Coord {
                lng: js_number(parts.next()),
                lat: js_number(parts.next()),
            }
        })
        .collect()
}

/// Map a k_2.1 (170-col) record onto the original 224-col layout.
fn map_k21(src: &[String]) -> Vec<String> {
    let get = |i: usize| src.get(i).cloned().unwrap_or_default();
    let mut dst = vec![String::new(); OLD_NCOLS];
    for i in 0..13 {
        dst[i] = get(i + 1);
    }
    dst[13] = get(15);
    dst[14] = get(20);
    dst[15] = get(21);
    dst[16] = get(22);
    dst[17] = get(23).replace(';', "\"");
    dst[18] = get(24);
    dst[19] = get(25);
    dst[21] = get(26);
    dst[22] = get(27);
    dst[23] = get(28);
    dst[27] = get(32);
    dst[34] = get(33);
    dst[35] = get(35);
    dst[37] = get(37);
    dst[41] = get(39);
    for i in 0..45 {
        dst[46 + i] = get(40 + i);
    }
    for i in 0..45 {
        dst[91 + i] = get(85 + i);
    }
    dst[138] = get(130);
    dst[139] = get(131);
    dst[146] = get(132);
    dst[148] = get(133);
    dst[149] = get(137);
    dst[154] = get(135);
    dst[155] = get(156);
    dst[156] = get(140);
    dst[158] = get(143);
    dst[160] = get(159);
    dst[161] = get(152);
    dst[163] = get(144);
    dst[166] = get(165);
    dst[167] = get(154);
    dst[168] = get(146);
    dst[169] = get(141);
    dst[176] = get(153);
    dst[177] = get(142);
    dst[186] = get(148);
    dst[190] = get(149);
    dst[191] = get(150);
    dst[192] = get(151);
    dst[199] = get(160);
    dst[200] = get(161);
    dst[201] = get(136);
    dst[204] = get(162);
    dst[206] = get(145);
    dst[208] = get(164);
    dst[209] = get(157);
    dst[210] = get(158);
    dst[211] = get(134);
    dst[218] = get(166);
    dst[220] = get(167);
    dst[221] = get(168);
    dst[223] = get(169);
    dst
}

fn normalize_row(row: Vec<String>) -> Vec<String> {
    if field(&row, 0) == "k_2.1" {
        map_k21(&row)
    } else {
        row
    }
}

fn should_skip(row: &[String]) -> bool {
    let unique_key = field(row, 14);
    let unique_n = js_number(Some(unique_key));
    let tokyo_skip = field(row, 0) == "8"
        && ((unique_n >= 13497.0 && unique_n <= 13607.0) || unique_key == "101782");
    tokyo_skip || field(row, 17).is_empty()
}

struct PreparedKisei {
    id: String,
    row: String,
    offsets: String,
    len: i64,
    minlat: f64,
    maxlat: f64,
    minlng: f64,
    maxlng: f64,
}

fn prepare_kisei(row: &[String]) -> Option<PreparedKisei> {
    let coords = parse_coords(field(row, 17));
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

    let mut filtered: Vec<String> = row
        .iter()
        .map(|s| {
            if s == "-1" || s == "0" {
                String::new()
            } else {
                s.clone()
            }
        })
        .collect();
    while filtered.len() < 136 {
        filtered.push(String::new());
    }
    let mut i = 46usize;
    while i < 136 {
        if field(&filtered, i + 2).is_empty() && !field(&filtered, i + 3).is_empty() {
            filtered[i + 2] = "0".to_string();
        }
        if field(&filtered, i + 3).is_empty() && !field(&filtered, i + 2).is_empty() {
            filtered[i + 3] = "0".to_string();
        }
        if pad_start_4(field(&filtered, i)) == "0101" && field(&filtered, i + 1) == "1231" {
            filtered[i].clear();
            filtered[i + 1].clear();
        }
        if pad_start_4(field(&filtered, i + 2)) == "0000" && field(&filtered, i + 3) == "2400" {
            filtered[i + 2].clear();
            filtered[i + 3].clear();
        }
        if pad_start_4(field(&filtered, i + 2)) == "0000" && field(&filtered, i + 3) == "2359" {
            filtered[i + 2].clear();
            filtered[i + 3].clear();
        }
        i += 9;
    }

    let id_src = format!("\"{}\"", row.join("\",\""));
    let id = format!("{:x}", md5::compute(id_src.as_bytes()));

    Some(PreparedKisei {
        id,
        row: filtered.join("\n"),
        offsets: offsets
            .iter()
            .map(|n| n.to_string())
            .collect::<Vec<_>>()
            .join("\n"),
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
           +id CHAR(32), +row TEXT, +offsets TEXT, +len INTEGER
         );
         BEGIN;",
    )?;

    let mut stmt = con.prepare(
        "INSERT INTO kiseis(pk, id, row, offsets, len, minlat, maxlat, minlng, maxlng)
         VALUES(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
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
            let raw: Vec<String> = rec.iter().map(|s| s.to_string()).collect();
            let row = normalize_row(raw);
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
