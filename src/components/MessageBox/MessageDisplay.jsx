import React from 'react';
import Message from "./Message";
import socket from "../../socket-api";

function MessageDisplay(props) {
    socket.on("connect", () => {
        console.log("Connected");
        socket.on("send-message", newMessage => {
            props.setMessages(prev => [...prev, newMessage]);
            // Scroll down with react-scrollable-feed
        });
    });

    return (
        <div className="overflow-auto mx-3" style={{ height: "90%", width: "90%" }}>
            {props.messages.map((message, idx) => <Message key={idx} message={message} />)}
        </div>);
}

export default MessageDisplay;