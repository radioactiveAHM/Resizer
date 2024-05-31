import { useRef, useState } from "react";
import { resize_advance } from "../core/resizer_core";

function Main() {
    const [imageLink, setImageLink] = useState({ blob: new Blob(), link: "" });
    const [resizedimageLink, setResizedimageLink] = useState("");
    const [rangers, setRangers] = useState({BlurV: 0.0, BrightenV: 0})

    const file = useRef();
    
    // I'm too lazy to setup a controller...
    const Width = useRef();
    const Height = useRef();
    const Resize_mode = useRef();
    const Filter = useRef();

    async function getBuffer() {
        // get image buffer
        await file.current.files[0].arrayBuffer().then((buff) => {
            setImageLink({
                blob: new Blob([buff], { type: file.current.files[0].type }),
                link: URL.createObjectURL(new Blob([buff], { type: file.current.files[0].type }))
            });
        });
    }

    async function resizer_advance_fn() {
        alert("Starting")
        // resize modes => resize , resize_exact , resize_to_fill
        // filter types => CatmullRom , Gaussian , Lanczos3 , Nearest , Triangle
        const newbuff = resize_advance(
            new Uint8Array(await imageLink.blob.arrayBuffer()), Width.current.value || 500, Height.current.value || 500,
            Resize_mode.current.value , Filter.current.value, rangers.BlurV, rangers.BrightenV
        );
        setResizedimageLink(URL.createObjectURL(new Blob([newbuff], { type: "image/png" })));
    }

    function range_val_controller(event){
        // event.target.value
        if (event.target.id === "blur"){
            setRangers((prev)=>{
                return {...prev, BlurV:event.target.value}
            })
        }else if (event.target.id === "brighten"){
            setRangers((prev)=>{
                return {...prev, BrightenV:event.target.value}
            })
        }
    }
    return (
        <main className="round">
            <div className="fileinput">
                <input type="file" accept="image/.png, .jpg, .jpeg" ref={file} onChange={getBuffer} />
                <img src={imageLink.link} alt=""/>
            </div>
            <div className="fileoutput">
                <div>
                    <div>
                        <div>
                            <label htmlFor="Width">Width</label>
                            <label htmlFor="Height">Height</label>
                            <label htmlFor="Resize_type">Resize type</label>
                            <label htmlFor="Filters">Filters</label>
                            <label htmlFor="blur">{`Blur(${rangers.BlurV})`}</label>
                            <label htmlFor="brighten">{`Bright(${rangers.BrightenV})`}</label>
                        </div>
                        <div>
                            <input type="number" id="Width" ref={Width}/>
                            <input type="number" id="Height" ref={Height}/>
                            <select id="Resize_type" ref={Resize_mode}>
                                <option value="resize">resize</option>
                                <option value="resize_exact">resize with stretch</option>
                                <option value="resize_to_fill">resize with crop</option>
                            </select>
                            <select id="Filters" ref={Filter}>
                                <option value="Lanczos3">Lanczos3</option>
                                <option value="CatmullRom">CatmullRom</option>
                                <option value="Gaussian">Gaussian</option>
                                <option value="Nearest">Nearest</option>
                                <option value="Triangle">Triangle</option>
                            </select>
                            <input type="range" id="blur" min="0.0" max="5.0" step="0.1" value={rangers.BlurV} onChange={range_val_controller}/>
                            <input type="range" id="brighten" min="-50" max="50" step="5" value={rangers.BrightenV} onChange={range_val_controller}/>
                        </div>
                    </div>
                    <button type="button" onClick={resizer_advance_fn}>resize</button>
                </div>
                <a target="_blank" rel="noreferrer" href={resizedimageLink}><img src={resizedimageLink} alt=""/></a>
            </div>
        </main>
    )
}

export default Main;