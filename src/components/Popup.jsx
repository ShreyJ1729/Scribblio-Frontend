import React, { useState } from "react";
import socket from "../socket-api.js";
import getRandomName from "../names.js";

function Popup(props) {
    const [username, setUsername] = useState("");
    const [nameInvalidMessage, setNameInvalidMessage] = useState(false);

    function handleInputChange(event) {
        setUsername(event.target.value);
    }

    function generateRandomName(event) {
        event.preventDefault();
        setUsername(getRandomName());
    }
    function handleSubmit(event) {
        // No http requests
        event.preventDefault();
        if (username === "") {
            // Return error if no username given
            console.log(event.target);
            setNameInvalidMessage({ status: true, message: "Please enter a username." })
        } else {
            // Check with regex if name is alphanumeric + spaces + "_" and "-"...
            let isNameValid = /^[\w\-\s]+$/.test(username);
            if (isNameValid) {
                socket.emit("send-username", username);
                props.setUsername(username);
            } else {
                // ...and return an error if it isn't
                setNameInvalidMessage({ status: true, message: "Usernames can only have the following types: letters, numbers, spaces, _ and -." });
            }
        }
    }

    return <div className="popup">
        <div className="popup_inner">
            <h3 className="text-center mt-5 mb-3">My name is...</h3>
            <form className="text-center" onSubmit={handleSubmit}>
                <input className="form form-control m-auto"
                    autoComplete="off" style={{ width: "70%" }}
                    type="text"
                    name="nameInput"
                    onChange={handleInputChange}
                    value={username}
                    placeholder={getRandomName()}>
                </input>
                {nameInvalidMessage ?
                    <p className="text-danger mt-2">{nameInvalidMessage.message}</p>
                    : <p className="mt-2">Press "Go" or hit ENTER to join.</p>}
                    
                <button className="btn btn-large btn-outline-dark mt-3 mx-1" type="submit" name="go">Go!</button>
                <button className="btn btn-large btn-outline-success mt-3 mx-1" onClick={generateRandomName} name="random-name">Random Name</button>
            </form>
        </div>
    </div>
}

export default Popup;