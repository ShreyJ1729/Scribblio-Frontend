import openSocket from "socket.io-client";
const socket = openSocket("https://scribblio.herokuapp.com/");
// const socket = openSocket("localhost:8000");
export default socket;