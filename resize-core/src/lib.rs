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