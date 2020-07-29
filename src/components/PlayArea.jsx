import React, { useState, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import socket from "../socket-api";
import ColorButton from "./ColorButton";

function PlayArea(props) {
    const [canThisUserDraw, setCanThisUserDraw] = useState(false);
    const [canvasData, setCanvasData] = useState("");
    const [brushColor, setBrushColor] = useState("000000");
    const [brushSize, setBrushSize] = useState(10);
    const [timeDisplay, setTimeDisplay] = useState(null);
    const blankCanvasData = '{"lines":[{"points":[{"x":-100,"y":0}, {"x":-100,"y":0}],"brushColor":"#000","brushRadius":1}],"width":"100%","height":"95%"}';
    const hexCodes = ["FFFFFF", "000000", "C1C1C1", "4C4C4C", "EF130B", "740B07", "FF7100", "C23800", "FFE400", "E8A200", "00CC00", "005510", "00B2FF", "00569E", "231FD3", "0E0865", "A300BA", "550069", "D37CAA", "A75574", "A0522D", "63300D"];
    let timerID = null;
    // Make canvas into an object of {sender, data} and then compare --> if onChange, the latest canvasData sender is not self dont emit
    // This is so that data received is one way --> otherwise it will be data gotten --> emittted same data back.
    // Wait this might not work.

    // Disable canvas until/unless server sends/sent a message that it's this user's turn
    useEffect(() => {
        // This code in here only runs once --> upon initial render.
        // There is no issue with props warning since username can't be changed and this component
        // is only rendered once username is sent
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

    useEffect(() => {
        socket.on("round-started", roundTimeInterval => {
            setTimeDisplay(roundTimeInterval/1000);
            timerID = setInterval(() => {
                setTimeDisplay(prev => prev - 1);
            }, 1000);
            console.log("Started TIMER!");
        });
    }, []);

    useEffect(() => {
        socket.on("round-ended", () => {
            clearInterval(timerID);
            setTimeDisplay(null);
        });
    }, []);


    function handleCanvasChange(event) {
        if (canThisUserDraw) {
            socket.emit("canvas-change", { data: event.getSaveData(), sender: props.username });
            console.log("You sent some data");
        }
    }

    function handleSliderChange(event) {
        setBrushSize(event.target.value);
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
        }
    }



    return (<div className="col-8">
        <CanvasDraw className="canvas"
            onChange={handleCanvasChange}
            canvasHeight="90%"
            canvasWidth="100%"
            hideGrid={true}
            lazyRadius={0}
            hideInterface={!canThisUserDraw}
            disabled={!canThisUserDraw}
            loadTimeOffset={0}
            immediateLoading={true}
            saveData={canvasData}
            brushColor={brushColor}
            brushRadius={brushSize}
        />
        <div className="row">
            <div className="col-1 my-0">
                <button className="my-0" onClick={forceClear}>CLEAR</button>
                <button className="my-0" onClick={undo}>UNDO</button>
            </div>
            <div className="col-5 my-0">
                <div className="col-12 my-0">
                    {hexCodes.map((hexCode, idx) => (idx % 2 === 1) ? <ColorButton key={idx} setBrushColor={setBrushColor} hexCode={hexCode} /> : null)}
                </div>
                <div className="col-12 my-0">

                    {hexCodes.map((hexCode, idx) => (idx % 2 === 0) ? <ColorButton key={idx} setBrushColor={setBrushColor} hexCode={hexCode} /> : null)}
                </div>
            </div>
            <div className="col-3">
                <input type="range" min="1" max="20" value={brushSize} onChange={handleSliderChange}></input>
                <h6>Change Brush Size</h6>
            </div>
            <div className="col-3">{timeDisplay}</div>
        </div>
    </div>)
}

export default PlayArea;