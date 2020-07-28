import React from "react";

function ColorButton(props) {

    function handleButtonClick() {
        console.log(props.hexCode);
        props.setBrushColor(`#${props.hexCode}`);
    }

    return <button className="my-0" onClick={handleButtonClick} style={{width: "30px", height: "30px", border: "none", background: `#${props.hexCode}`}}></button>
}

export default ColorButton;