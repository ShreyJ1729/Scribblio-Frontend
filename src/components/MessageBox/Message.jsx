import React from "react";

    // Multi-condition express syntax:
    // var yourVar =
    // condition1 ? value1
    // : condition2 ? value2
    // ...
    // defaultValue

function Message(props) {
    return (<div>
        {
        props.message.type === "meta-join" ?
        <p className="my-0 text-success"><strong>{props.message.username}</strong> {props.message.content}</p>
        : props.message.type === "meta-leave" ?
        <p className="my-0 text-danger"><strong>{props.message.username}</strong> {props.message.content}</p>
        : <p className="my-0"><strong>{props.message.sender}:</strong> {props.message.content}</p>
    }
    </div>);
}

export default Message;