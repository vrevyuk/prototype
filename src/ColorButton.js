import "./ColorButton.css"

function ColorButton(props) {
    const onClick = () => {
        props.onClick(props.color);
    }

    return <button disabled={props.disabled} onClick={onClick} className="ColorButton" style={{"backgroundColor": props.color}}></button>
}

export default ColorButton;
