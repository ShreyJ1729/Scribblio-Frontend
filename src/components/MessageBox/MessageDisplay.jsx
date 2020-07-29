import React, { useEffect } from 'react';
import Message from "./Message";
import AutoScroll from 'react-scroll-to-bottom';
import socket from "../../socket-api";
function MessageDisplay(props) {

    useEffect(() => {
        // This code in here only runs once --> upon initial render.
        socket.on("connect", () => {
            console.log("Connected To Server.");
            socket.on("send-message", newMessage => {
                props.setMessages(prev => [...prev, newMessage]);
                console.log("YOU GOT A NEW MESSAGE:" + newMessage);
            });
        });
        return function cleanupSockets() {
            socket.off("connect");
            socket.off("send-message");
        }
    }, []);


    return (
        <div style={{ height: "85%" }}>
            <AutoScroll className="overflow-auto mx-2" >
                {props.messages.map((message, idx) => <Message key={idx} message={message} />)}
            </AutoScroll>
        </div>);
}

export default MessageDisplay;