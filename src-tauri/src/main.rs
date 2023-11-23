use std::{
    cell::RefCell,
    collections::HashMap,
    env,
    fs::{self, File},
    io::Write,
    path::PathBuf,
    sync::Mutex,
};

use anyhow::{anyhow, Result};
use clap::{FromArgMatches, Parser};
use serde::{Deserialize, Serialize};
use spin_manifest::schema::v2::AppManifest;
use toml;
use wasm_compose::graph::CompositionGraph;
use wit_component::WitPrinter;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

const DEFAULT_MANIFEST_NAME: &'static str = "spin.toml";

struct SpinBuilder {
    components: Mutex<RefCell<HashMap<String, Vec<u8>>>>,
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
    let trigger_bytes: Vec<u8> = include_bytes!("dummy_http_trigger.wasm").to_vec();
    let components = Mutex::new(RefCell::new(HashMap::default()));
    components
        .lock()
        .unwrap()
        .get_mut()
        .insert("http_trigger".to_owned(), trigger_bytes);
    tauri::Builder::default()
        .manage(SpinBuilder {
            manifest_file: app_manifest_source,
            components,
        })
        .invoke_handler(tauri::generate_handler![
            get_manifest,
            save_manifest,
            parse_wasm_binary,
            download_parse_wasm,
            read_parse_wasm,
            validate_connection,
        ])
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
    let file_path = &state.manifest_file;
    let val: AppManifest = serde_json::from_str(&json_manifest).map_err(|err| err.to_string())?;

    let toml_string = toml::to_string_pretty(&val).unwrap();

    // Write the TOML string to a file
    let mut file = File::create(file_path).unwrap();
    file.write_all(toml_string.as_bytes()).unwrap();

    Ok("".to_owned())
}

#[derive(Serialize, Deserialize, Default)]
struct WasmBinaryParsedResult {
    imports: Vec<String>,
    exports: Vec<String>,
    wit: String,
    id: Option<u32>,
}

#[tauri::command]
async fn parse_wasm_binary(
    state: tauri::State<'_, SpinBuilder>,
    name: String,
    bytes: Vec<u8>,
) -> Result<WasmBinaryParsedResult, String> {
    let bytes = spin_componentize::componentize_if_necessary(&bytes).map_err(|e| e.to_string())?;

    let mut ret = WasmBinaryParsedResult::default();
    let component = wasm_compose::graph::Component::from_bytes(name.clone(), bytes)
        .map_err(|e| format!("{e:#}"))?;
    for import in component.imports() {
        ret.imports.push(import.1.to_owned());
    }
    for export in component.exports() {
        ret.exports.push(export.1.to_owned());
    }
    let wit = match wit_component::decode(component.bytes()) {
        Ok(decoded) => {
            // Print the wit for the component
            let resolve = decoded.resolve();
            let mut printer = WitPrinter::default();
            let mut wit = String::new();
            for (i, (id, _)) in resolve.packages.iter().enumerate() {
                if i > 0 {
                    wit.push_str("\n\n");
                }
                match printer.print(resolve, id) {
                    Ok(s) => wit.push_str(&s),
                    Err(e) => {
                        // If we can't print the document, just use the error text
                        wit = format!("{e:#}");
                        break;
                    }
                }
            }
            wit
        }
        Err(e) => {
            // If we can't decode the component, just use the error text
            format!("{e:#}")
        }
    };
    state
        .inner()
        .components
        .lock()
        .unwrap()
        .get_mut()
        .insert(name, component.bytes().to_vec());
    ret.wit = wit;
    Ok(ret)
}

#[tauri::command]
fn validate_connection(
    state: tauri::State<'_, SpinBuilder>,
    source_component_name: String,
    source_export_name: String,
    target_component_name: String,
    target_import_name: String,
) -> Result<bool, String> {
    let mut graph = CompositionGraph::default();
    let mut components = state.inner().components.lock().unwrap();
    let something = components.get_mut();

    let source_component_bytes = something.get(&source_component_name).unwrap();
    let source_component =
        wasm_compose::graph::Component::from_bytes(source_component_name, source_component_bytes)
            .map_err(|e| e.to_string())?;
    let source_component_id = graph.add_component(source_component).unwrap();
    let (source_export_index, _, _) = graph
        .get_component(source_component_id)
        .unwrap()
        .export_by_name(&source_export_name)
        .unwrap();

    let target_component_bytes = something.get(&target_component_name).unwrap();

    let target_component =
        wasm_compose::graph::Component::from_bytes(target_component_name, target_component_bytes)
            .map_err(|e| e.to_string())?;
    let target_component_id = graph.add_component(target_component).unwrap();
    let (target_import_index, _) = graph
        .get_component(target_component_id)
        .unwrap()
        .import_by_name(&target_import_name)
        .unwrap();

    let source_instance_id = graph.instantiate(source_component_id).unwrap();
    let target_instance_id = graph.instantiate(target_component_id).unwrap();

    match graph.connect(
        source_instance_id,
        Some(source_export_index),
        target_instance_id,
        target_import_index,
    ) {
        Ok(_) => Ok(true),
        Err(err) => Err(format!("{err:#}")),
    }
}

#[tauri::command]
async fn read_parse_wasm(
    state: tauri::State<'_, SpinBuilder>,
    path: String,
    name: String,
) -> Result<WasmBinaryParsedResult, String> {
    let mut proj_dir = state.manifest_file.clone();
    proj_dir.pop();
    let file_path = proj_dir.join(path);
    let bytes = fs::read(file_path).map_err(|e| format!("{e:#}"))?;
    parse_wasm_binary(state, name, bytes).await
}

#[tauri::command]
async fn download_parse_wasm(
    state: tauri::State<'_, SpinBuilder>,
    url: String,
    name: String,
) -> Result<WasmBinaryParsedResult, String> {
    let bytes = download_file(&url).map_err(|e| format!("{e:#}"))?;
    parse_wasm_binary(state, name, bytes).await
}

fn download_file(url: &str) -> Result<Vec<u8>> {
    // Send an HTTP GET request to the specified URL
    let response = reqwest::blocking::get(url)?;

    // Ensure the request was successful (status code 200)
    if !response.status().is_success() {
        return Err(anyhow!("function failed"));
    }

    // Read the response body and convert it to bytes
    let bytes = response.bytes()?;

    Ok(bytes.to_vec())
}
