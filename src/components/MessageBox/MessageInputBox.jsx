import React, { useState } from "react";
import socket from "../../socket-api";

function MessageInputBox(props) {

    const [messageInput, setMessageInput] = useState("");

    function handleEnterKey(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (messageInput !== "") {
                socket.emit("send-message", messageInput);
                setMessageInput("");
            }
        }
    }

    function handleInputChange(event) {
        setMessageInput(event.target.value);
    }

    return (
        <textarea className="form-control mb-3 border border-secondary"
            type="text"
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
            value={messageInput}
            name="messageInput"
            id="messageInput"
            autoComplete="off"
            rows="2"
            placeholder="Type To Chat..."
            style={{ resize: "none", display: "block", margin: "auto", width: "90%" }}></textarea>);
}
export default MessageInputBox;