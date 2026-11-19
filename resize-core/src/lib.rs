mod utils;

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn resize_advance(
    buff: &[u8],
    w: u32,
    h: u32,
    resize_mode: &str,
    filter: &str,
    blur: f32,
    brighten: i32,
    format: &str,
    quality: u8
) -> Option<Vec<u8>> {
    advance_resizer_core(buff, w, h, resize_mode, filter, blur, brighten, format, quality).ok()
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

fn advance_resizer_core(
    imgbuff: &[u8],
    w: u32,
    h: u32,
    resize_mode: &str,
    filter: &str,
    blur: f32,
    brighten: i32,
    format: &str,
    quality: u8
) -> image::error::ImageResult<Vec<u8>> {
    let mut img_format: image::ImageFormat = image::guess_format(imgbuff)?;
    let mut img = image::load_from_memory_with_format(imgbuff, img_format)?;

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

    img_format = match format {
        "image/jpeg" => image::ImageFormat::Jpeg,
        "image/png" => image::ImageFormat::Png,
        "image/webp" => image::ImageFormat::WebP,
        _ => return Err(image::ImageError::Unsupported(image::error::ImageFormatHint::Unknown.into()))
    };

    let mut buf = std::io::Cursor::new(Vec::new());

    match img_format {
        image::ImageFormat::Jpeg => {
            image::codecs::jpeg::JpegEncoder::new_with_quality(&mut buf, quality).encode_image(&img)?;
        }
        _ => {
            img.write_to(&mut buf, img_format)?;
        }
    }

    Ok(buf.into_inner())
}
