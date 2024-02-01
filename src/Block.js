import { isValidAutomergeUrl } from '@automerge/automerge-repo';
import {useDocument} from '@automerge/automerge-repo-react-hooks'

import "./Block.css";
import ColorButton from "./ColorButton";

const COLORS = [
    "#FFFFFF", "#FEF445", "#FAC710", "#F24726", "#DA0063", "#C6C8CA", "#CEE741",
    "#8FD14F", "#0CA789", "#9510AC", "#12CDD4", "#4CA0E8", "#414BB2", "#652CB3"
]

const SIZES = {
    "BIGGEST": 40,
    "BIG": 20,
    "MEDIUM": 15,
    "SMALL": 10,
    "SMALLEST": 5,
}

function Block(props) {
    const urlIsValid = isValidAutomergeUrl(props.documentHash);
    const [docHandle, changeDocHandle] = useDocument(props.documentHash);
    console.log("XXX", docHandle)

    const changeText = text => {
        // console.log("setText 1", text, urlIsValid, docHandle);
        changeDocHandle(doc => {
            doc.text = text;
        });
    }

    const changeSize = size => {
        // console.log("setFontSize", size, urlIsValid, docHandle);
        changeDocHandle(doc => {
            doc.fontSize = size;
        });
    }

    const changeBackgroundColor = color => {
        // console.log("setBackgroundColor", color, urlIsValid, docHandle)
        changeDocHandle(doc => {
            doc.backgroundColor = color;
        });
    }

    return (
        <div className="Main">
            <div className="ButtonsBlock">
                <p>{props.documentHash}</p>
            </div>
            <textarea className="TextArea"
                      cols={50}
                      rows={10}
                      onInput={e => changeText(e.target.value)}
                      disabled={!urlIsValid}
                      value={docHandle && docHandle.text}
                      style={{
                          backgroundColor: docHandle && docHandle.backgroundColor,
                          fontSize: docHandle && docHandle.fontSize + "px",
                      }}
            ></textarea>
            <div className="ButtonsBlock">
                { COLORS.map(color => (
                    <ColorButton key={color} onClick={changeBackgroundColor} color={color} disabled={!urlIsValid} />
                ) )}
            </div>
            <div className="ButtonsBlock">
                { Object.entries(SIZES).map(([key, value]) => (
                    <button key={key}
                            className="SizeButton"
                            onClick={() => changeSize(value)}
                    >{value}px</button>
                )) }
            </div>
        </div>
    )
}

export default Block
