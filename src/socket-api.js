import openSocket from "socket.io-client";
const socket = openSocket("localhost:8000");
export default socket;