mod utils;


use std::collections::HashSet;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use std::error::Error;
use std::io::prelude::*;

use image::GenericImage;
use image::imageops::FilterType;

use std::fmt;


#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]

extern {
    fn alert(s: &str);
}





#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}


#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
   
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");
    // let canvas=documen
    // Manufacture the element we're gonna append
    let val = document.create_element("canvas")?;
    let canvass = document.get_element_by_id("canvas").unwrap();
    // val.set_inner_html("Hello from Rust!");

    // body.append_child(&val)?;
    let canvas: web_sys::HtmlCanvasElement = canvass
    .dyn_into::<web_sys::HtmlCanvasElement>()
    .map_err(|_| ())
    .unwrap();

 

    let windows: web_sys::Window =web_sys::window().unwrap();
    // let width=windows.inner_width()?;
    // let height=windows.inner_height()?;
    let uwidth=640f64;
    let uheight=480f64;
    console_log!("createdddd module has {}  {} pages of memory",uwidth,uheight );
    let context = canvas
    .get_context("2d")
    .unwrap()
    .unwrap()
    .dyn_into::<web_sys::CanvasRenderingContext2d>()
    .unwrap();

    canvas.set_width(uwidth as u32);
    canvas.set_height(uheight as u32);

    context.set_fill_style(&"#000000".into());        
  
    context.fill_rect(0.0, 0.0, uwidth, uheight);
    context.set_font("15px Arial");
    context.set_fill_style(&"#ffffff".into());
    context.fill_text("Hello World", 0.0, 10.0);
    
   



    Ok(())
}

#[wasm_bindgen]
pub fn render() {
    let document = web_sys::window().unwrap().document().unwrap();
    let windows: web_sys::Window =web_sys::window().unwrap();
    //  let width=windows.inner_width().unwrap();
    // let height=windows.inner_height().unwrap();
    let uwidth=640f64;
    let uheight=480f64;
    let canvas = document.get_element_by_id("canvas").unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();


        let canvas_one = document.get_element_by_id("canvasone").unwrap();
        let canvas_one: web_sys::HtmlCanvasElement = canvas_one
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();
    // let svg_path = document.get_element_by_id("outputpath").unwrap();
    let context_one = canvas_one
    .get_context("2d")
    .unwrap()
    .unwrap()
    .dyn_into::<web_sys::CanvasRenderingContext2d>()
    .unwrap();

    let data = context_one.get_image_data(0.0, 0.0,640.0, 480.0).unwrap().data();

    // let source = image::RgbaImage::from_raw(512, 512, data.to_vec()).unwrap();

    // let img = image::open(&Path::new(image_url)).unwrap();
    // let character_set: [&str; 11] = ["@", "#", "0", "O", "L", ";", ":", ".", ",", "'", " "];
    // let mut art = String::new();
    let mut last_y = 0;

    let temp = image::DynamicImage::ImageRgba8(image::RgbaImage::from_raw(640, 480, data.to_vec()).unwrap());
    
    let ss = temp.resize(426 , 240, FilterType::Nearest);
    let source = ss.into_rgba8();

    // console_log!("values {:?}",source);
    let character_set: [&str; 11] = ["#", "%", "&", "$", "@", ";",";", ".", ".", " ", " "];
        let mut art = String::new();
        let mut last_y = 0;
        let mut width = source.width() as usize;
        // console_log!("ttttttt {:?} ",source.pixels().len());
        let mut str_array=Vec::<String>::new();
    for (i,pixel) in source.pixels().enumerate(){ 
        // let ii=pixel.channel_count();
        let reminder = i%width;
        // console_log!("reminder {} ",reminder);
        if reminder==0  {
            let ss=art.clone().chars()
            .collect::<Vec<char>>()
            .chunks(5)
            .map(|c| c.iter().collect::<String>())
            .collect::<Vec<String>>()
            .join(" ");
            str_array.push(ss);
            art.clear();
         
        }

        let pixel_data = pixel[2];
        let brightness:f64 = ((pixel[0] as u64 + pixel[1] as u64 + pixel[2] as u64) / 3) as f64;
        let character_position = ((brightness/255.0) * (character_set.len()  - 1) as f64 ).round() as usize;
        art.push_str(character_set[character_position])
    }
    // console_log!("array length  {}",str_array.len());


    context.set_fill_style(&"#000000".into());        
  
    context.fill_rect(0.0, 0.0, 640f64, 480f64);
    context.set_font("12px Arial");
    context.set_fill_style(&"#09b035".into());
    // console_log!("ffgggvv {:?} {}",str_array.get(0),str_array.len());
    for (i,srr) in str_array.iter().enumerate(){
        // if(i<9){
        context.fill_text(&srr[..], 10.0, i as f64*12.0);
        // }
    }
   
    str_array.clear();

   
  
    // let path_data = swirl(&source);

    
}

// fn convert_to_ascii(image_url: &str, resolution: u32, output: &str) -> String {
//     let img = image::open(&Path::new(image_url)).unwrap();
//     let character_set: [&str; 11] = ["@", "#", "0", "O", "L", ";", ":", ".", ",", "'", " "];
//     let mut art = String::new();
//     let mut last_y = 0;

//     let small_img = img.resize(img.width() / resolution, img.height() / resolution, FilterType::Nearest);

//     println!("Original size: {:?}   Reduced: {:?}", img.dimensions(), small_img.dimensions());

//     for pixel in small_img.pixels() {
//         if last_y != pixel.1 {
//             art.push_str("\n");
//             last_y = pixel.1;
//         }

//         let pixel_data = pixel.2.data;
//         let brightness:f64 = ((pixel_data[0] as u64 + pixel_data[1] as u64 + pixel_data[2] as u64) / 3) as f64;
//         let character_position = ((brightness/255.0) * (character_set.len()  - 1) as f64 ).round() as usize;
//         art.push_str(character_set[character_position])
//     }