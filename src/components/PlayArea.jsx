import React, { useState } from "react";
import CanvasDraw from "react-canvas-draw";
import socket from "../socket-api";

function PlayArea(props) {
    // Disable canvas until server sends a message that it's this user's turn
    const [canThisUserDraw, setCanThisUserDraw] = useState(true);
    const [canvasData, setCanvasData] = useState("");
    socket.on("drawer-change", newDrawer => {
        if (props.username === newDrawer) {
            setCanThisUserDraw(true);
            console.log("You can draw now!");
        } else {
            setCanThisUserDraw(false);
            console.log("You can't draw now! Sorry!")
        }
    })
    socket.on("canvas-change", newCanvasData => {
        console.log("You got some data");
        setCanvasData(newCanvasData.data);
    });

    function handleCanvasChange(event) {
        if (canThisUserDraw) {
            socket.emit("canvas-change", { data: event.getSaveData(), sender: props.username });
            console.log("You sent some data");
        }
    }
    
    return (<div className="col-8">
        <CanvasDraw className="canvas"
            onChange={handleCanvasChange}
            canvasHeight="100%"
            canvasWidth="100%"
            hideGrid={true}
            lazyRadius={0}
            disabled={!canThisUserDraw}
            hideInterface={!canThisUserDraw}
            loadTimeOffset={0}
            immediateLoading={true}
            saveData={canvasData}
            loadSaveData={null}
            ref={instance => console.log(instance)}
        />
    </div>)
}

export default PlayArea;