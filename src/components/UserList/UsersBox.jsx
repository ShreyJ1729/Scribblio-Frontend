import React, { useState } from "react";
import socket from "../../socket-api";

// IMPLEMENT AUTOSCROLL CHAT BOX

function UsersBox(props) {
    const [users, setUsers] = useState([]);
    const [host, setHost] = useState("");
    const [usersReady, setUsersReady] = useState([]);
    socket.on("user-list", userList => {
        setUsers(userList);
    });

    socket.on("new-host", hostName => {
        setHost(hostName);
    });

    socket.on("ready-change", usersReady => {
        setUsersReady(usersReady);
    })

    return <div className="card mt-3 border border-secondary UserListBox" style={{ width: "12%" }}>
        <h5 className="text-center">Players online: {users.length}</h5>

        <ul>
            {users.map((user, idx) => {
                let hostPrefix = "";
                if (user === host) {
                    hostPrefix = "Host: ";
                }
                return (usersReady.includes(user) ? <li className="text-success" key={idx}><strong>{hostPrefix}{user}</strong></li>
                    : <li className="text-danger" key={idx}><strong>{hostPrefix}{user}</strong></li>);
            }
            )}
        </ul>
    </div>
}

export default UsersBox;