import React from "react";
import MessageDisplay from "./MessageDisplay";
import MessageInputBox from "./MessageInputBox";

function MessageArea(props) {
    return <div className="card mt-3 border border-secondary"  style={{height: "95vh", width: "20%"}}>
        <MessageDisplay messages = {props.messages} setMessages={props.setMessages}/>
        <hr></hr>
        <MessageInputBox setMessages={props.setMessages} />
    </div>
}


export default MessageArea;

