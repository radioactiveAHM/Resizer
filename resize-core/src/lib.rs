mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub extern  "C" fn resize(buff:Vec<u8>, w:u32, h:u32)->Vec<u8>{
    let resized_buff = resizer_core(buff, w, h);
    resized_buff.get_ref().to_owned()
}


fn resizer_core(imgbuff:Vec<u8>, w:u32, h:u32)->std::io::Cursor<Vec<u8>>{
    let img = image::load_from_memory(&imgbuff).unwrap();
    let result = img.resize(w, h, image::imageops::Lanczos3);
    
    let mut wt = std::io::Cursor::new(Vec::new());
    result.write_to(&mut wt, image::ImageFormat::Png).unwrap();
    wt
}

#[wasm_bindgen]
pub extern  "C" fn resize_advance(buff:Vec<u8>, w:u32, h:u32, resize_mode: &str, filter:&str)->Vec<u8>{
    let resized_buff = advance_resizer_core(buff, w, h, resize_mode, filter);
    resized_buff.get_ref().to_owned()
}

fn filter_pick(filter:&str)->image::imageops::FilterType{
    match filter {
        "CatmullRom" => image::imageops::CatmullRom,
        "Gaussian" => image::imageops::Gaussian,
        "Lanczos3" => image::imageops::Lanczos3,
        "Nearest" => image::imageops::Nearest,
        "Triangle" => image::imageops::Triangle,
        _=> image::imageops::Lanczos3
    }
}
// NEW
fn advance_resizer_core(imgbuff:Vec<u8>, w:u32, h:u32, resize_mode: &str, filter:&str)->std::io::Cursor<Vec<u8>>{
    let img = image::load_from_memory(&imgbuff).unwrap();
    let result = match resize_mode {
        "resize"=> img.resize(w, h, filter_pick(filter)),
        "resize_exact"=> img.resize_exact(w, h, filter_pick(filter)),
        "resize_to_fill"=> img.resize_to_fill(w, h, filter_pick(filter)),
        _=> img.resize(w, h, filter_pick(filter)),
    };

    let mut wt = std::io::Cursor::new(Vec::new());
    result.write_to(&mut wt, image::ImageFormat::Png).unwrap();
    wt
}
