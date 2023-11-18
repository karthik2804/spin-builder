use std::{env, fs::File, io::Write, path::PathBuf};

use anyhow::Result;
use clap::{FromArgMatches, Parser};
use spin_manifest::schema::v2::AppManifest;
use toml;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

const DEFAULT_MANIFEST_NAME: &'static str = "spin.toml";

struct SpinBuilder {
    manifest_file: PathBuf,
}

#[derive(Parser, Debug)]
#[clap(about = "Spin builder")]
struct App {
    #[clap(name = "app_manifest", short = 'f', long = "from", group = "source")]
    pub app_source: Option<PathBuf>,
}

fn main() -> Result<()> {
    let mut app = App::clap();
    app.set_bin_name("spin builder");
    let matches = app.get_matches();

    let cli = App::from_arg_matches(&matches)?;

    let app_manifest_source = match cli.app_source {
        Some(path) => path,
        None => env::current_dir()?.join(DEFAULT_MANIFEST_NAME),
    };

    tauri::Builder::default()
        .manage(SpinBuilder {
            manifest_file: app_manifest_source,
        })
        .invoke_handler(tauri::generate_handler![get_manifest, save_manifest])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[tauri::command]
fn get_manifest(state: tauri::State<SpinBuilder>) -> Result<String, String> {
    let file_path = &state.manifest_file;
    let val = spin_manifest::manifest_from_file(file_path).map_err(|err| err.to_string())?;
    let manifest_json = serde_json::to_string(&val).map_err(|err| err.to_string())?;

    Ok(manifest_json)
}

#[tauri::command]
fn save_manifest(
    state: tauri::State<SpinBuilder>,
    json_manifest: String,
) -> Result<String, String> {
    let _file_path = &state.manifest_file;
    let val: AppManifest = serde_json::from_str(&json_manifest).map_err(|err| err.to_string())?;
    println!("{:#?}", val);

    let toml_string = toml::to_string_pretty(&val).unwrap();

    // Write the TOML string to a file
    let mut file = File::create("output.toml").unwrap();
    file.write_all(toml_string.as_bytes()).unwrap();

    Ok("".to_owned())
}
