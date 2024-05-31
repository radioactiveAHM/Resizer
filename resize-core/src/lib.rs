mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub extern  "C" fn resize_advance(buff: &[u8],w: u32,h: u32,resize_mode: &str,filter: &str,blur: f32,brighten: i32) -> Vec<u8> {
    let resized_buff = advance_resizer_core(buff, w, h, resize_mode, filter, blur, brighten);
    resized_buff.get_ref().to_owned()
}

fn filter_pick(filter: &str) -> image::imageops::FilterType {
    match filter {
        "CatmullRom" => image::imageops::CatmullRom,
        "Gaussian" => image::imageops::Gaussian,
        "Lanczos3" => image::imageops::Lanczos3,
        "Nearest" => image::imageops::Nearest,
        "Triangle" => image::imageops::Triangle,
        _ => image::imageops::Lanczos3,
    }
}

fn advance_resizer_core(imgbuff: &[u8],w: u32,h: u32,resize_mode: &str,filter: &str,blur: f32,brighten: i32) -> std::io::Cursor<Vec<u8>> {
    let mut img = image::load_from_memory(&imgbuff).unwrap();
    img = match resize_mode {
        "resize" => img.resize(w, h, filter_pick(filter)),
        "resize_exact" => img.resize_exact(w, h, filter_pick(filter)),
        "resize_to_fill" => img.resize_to_fill(w, h, filter_pick(filter)),
        _ => img.resize(w, h, filter_pick(filter)),
    };

    // Other options
    if blur != 0.0 {
        img = img.blur(blur);
    }
    if brighten != 0 {
        img = img.brighten(brighten);
    }

    let mut wt = std::io::Cursor::new(Vec::new());
    img.write_to(&mut wt, image::ImageFormat::Png).unwrap();
    wt
}
