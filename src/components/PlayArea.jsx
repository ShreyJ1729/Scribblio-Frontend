import React, { useState, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import socket from "../socket-api";

function PlayArea(props) {
    const [canThisUserDraw, setCanThisUserDraw] = useState(false);
    const [canvasData, setCanvasData] = useState("");
    const blankCanvasData = '{"lines":[{"points":[{"x":0,"y":0}, {"x":2000,"y":2000}],"brushColor":"#fff","brushRadius":1}],"width":"100%","height":"95%"}';
    // Make canvas into an object of {sender, data} and then compare --> if onChange, the latest canvasData sender is not self dont emit
    // This is so that data received is one way --> otherwise it will be data gotten --> emittted same data back.
    // Wait this might not work.
    // Disable canvas until/unless server sends/sent a message that it's this user's turn
    useEffect(() => {
        // This code in here only runs once --> upon initial render.
        socket.on("drawer-change", newDrawer => {
            if (newDrawer === "everyone") {
                setCanThisUserDraw(true);
                console.log("everyone can draw now!");
            } else if (newDrawer === "no one") {
                setCanThisUserDraw(false);
                console.log("no one can draw now!");
            } else if (props.username === newDrawer) {
                setCanThisUserDraw(true);
                console.log("You can draw now!");
            } else {
                setCanThisUserDraw(false);
                console.log("You can't draw now! Sorry!");
                console.log("New Drawer/Your Name: " + newDrawer + " / " + props.username);
            }
        });
        return () => {
            socket.off("drawer-change");
        }
    }, []);

    useEffect(() => {
        // This code in here only runs once --> upon initial render.
        socket.on("canvas-change", newCanvasData => {
            console.log("YOU GOT SOME CANVAS DATA:");
            console.log(newCanvasData);
            setCanvasData(newCanvasData.data);
        });
        return () => {
            socket.off("canvas-change");
        }
    }, []);

    useEffect(() => {
        // This code in here only runs once --> upon initial render.
        socket.on("clear-canvas", () => {
            console.log("got a message to clear canvas");
            forceClear();
        });
        return () => {
            socket.off("clear-canvas");
        }
    }, []);


    function handleCanvasChange(event) {
        if (canThisUserDraw) {
            socket.emit("canvas-change", { data: event.getSaveData(), sender: props.username });
            console.log("You sent some data" + event.getSaveData());
        }
    }

    function forceClear() {
        if (canThisUserDraw) {
            setCanvasData(blankCanvasData);
            socket.emit("clear-canvas");
            handleCanvasChange({
                getSaveData: function () {
                    return blankCanvasData;
                }
            });
            console.log("CLEARED CANVAS");
        }
    }

    function undo() {
        if (canThisUserDraw) {
        socket.emit("undo-canvas");
    }}


    return (<div className="col-8">
        <CanvasDraw className="canvas"
            onChange={handleCanvasChange}
            canvasHeight="95%"
            canvasWidth="100%"
            hideGrid={true}
            lazyRadius={0}
            hideInterface={!canThisUserDraw}
            disabled={!canThisUserDraw}
            loadTimeOffset={0}
            immediateLoading={true}
            saveData={canvasData}
        />
        <button onClick={forceClear}>CLEAR</button>
        <button onClick={undo}>UNDO</button>
    </div>)
}

export default PlayArea;