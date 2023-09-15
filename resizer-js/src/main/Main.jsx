import { useRef, useState } from "react";
import { resize_advance } from "../core/resizer_core";

function Main() {
    const [imageLink, setImageLink] = useState({ "blob": new Blob(), "link": "" });
    const [resizedimageLink, setResizedimageLink] = useState("");

    let file = useRef();
    
    // I'm too lazy to setup a controller...
    let Width = useRef();
    let Height = useRef();
    let Resize_mode = useRef();
    let Filter = useRef();

    async function getBuffer() {
        // get image buffer
        await file.current.files[0].arrayBuffer().then((buff) => {
            setImageLink({
                blob: new Blob([buff], { type: file.current.files[0].type }),
                link: URL.createObjectURL(new Blob([buff], { type: file.current.files[0].type }))
            });
        });
    }

    // async function resizer_fn() {
    //     let newbuff = resize(new Uint8Array(await imageLink.blob.arrayBuffer()), Width.current.value || 500, Height.current.value || 500);
    //     setResizedimageLink(URL.createObjectURL(new Blob([newbuff], { type: "image/png" })));
    // }
    async function resizer_advance_fn() {
        // resize modes => resize , resize_exact , resize_to_fill
        // filter types => CatmullRom , Gaussian , Lanczos3 , Nearest , Triangle
        let newbuff = resize_advance(
            new Uint8Array(await imageLink.blob.arrayBuffer()), Width.current.value || 500, Height.current.value || 500,
            Resize_mode.current.value , Filter.current.value
        );
        setResizedimageLink(URL.createObjectURL(new Blob([newbuff], { type: "image/png" })));
    }
    return (
        <main className="round">
            <div className="fileinput">
                <input type="file" accept="image/.png, .jpg, .jpeg" ref={file} onChange={getBuffer} />
                <img src={imageLink.link} />
            </div>
            <div className="fileoutput">
                <div>
                    <div>
                        <div>
                            <label htmlFor="Width">Width</label>
                            <label htmlFor="Height">Height</label>
                            <label htmlFor="Resize_type">Resize type</label>
                            <label htmlFor="Filters">Filters</label>
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
                        </div>
                    </div>
                    <button onClick={resizer_advance_fn}>resize</button>
                </div>
                <a target="_blank" rel="noreferrer" href={resizedimageLink}><img src={resizedimageLink} /></a>
            </div>
        </main>
    )
}

export default Main;