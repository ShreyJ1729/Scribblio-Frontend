import React, { useState } from "react";
import socket from "../../socket-api";

function UsersBox() {
    const [users, setUsers] = useState([]);
    const [host, setHost] = useState("");
    socket.on("user-list", userList => {
        setUsers(userList);
    });

    socket.on("new-host", hostName => {
        setHost(hostName);
    })

    return <div className="card mt-3 border border-secondary UserListBox" style={{ width: "12%" }}>
        <h5 className="text-center">Users online: {users.length}</h5>

        <ul>
            {users.map((user, idx) => {
                if (user === host) {
                    return <li key={idx}>Host: {user}</li>
                } else {
                    return <li key={idx}>{user}</li>
                }
            })}
        </ul>
    </div>
}

export default UsersBox;