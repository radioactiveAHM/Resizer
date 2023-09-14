import { useRef, useState } from "react";
import { resize } from "../core/resizer_core";

function Main() {
    const [imageLink, setImageLink] = useState({ "blob": new Blob(), "link": "" });
    const [resizedimageLink, setResizedimageLink] = useState("");

    let file = useRef();
    
    // I'm too lazy to setup a controller...
    let Width = useRef();
    let Height = useRef();

    async function getBuffer() {
        // get image buffer
        await file.current.files[0].arrayBuffer().then((buff) => {
            setImageLink({
                blob: new Blob([buff], { type: file.current.files[0].type }),
                link: URL.createObjectURL(new Blob([buff], { type: file.current.files[0].type }))
            });
        });
    }

    async function resizer_fn() {
        let newbuff = resize(new Uint8Array(await imageLink.blob.arrayBuffer()), Width.current.value || 500, Height.current.value || 500);
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
                    <label htmlFor="Width">Width: </label>
                    <input type="number" id="Width" ref={Width}/>
                    <br />
                    <label htmlFor="Height">Height: </label>
                    <input type="number" id="Height" ref={Height}/>
                    <br />
                    <button onClick={resizer_fn}>resize</button>
                </div>
                <a target="_blank" rel="noreferrer" href={resizedimageLink}><img src={resizedimageLink} /></a>
            </div>
        </main>
    )
}

export default Main;