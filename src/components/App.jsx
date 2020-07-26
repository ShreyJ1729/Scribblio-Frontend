import React, { useState } from 'react';
import MessageArea from "./MessageBox/MessageArea"
import Popup from "./Popup";
import PlayArea from "./PlayArea";
import UsersBox from './UserList/UsersBox';

function App() {
  const [messages, setMessages] = useState([]);
  const [Username, setUsername] = useState("");
  return (
    <div>
      <div className="row">
      {/* This div below will have a list of names of ppl currently connected */}
        <UsersBox />
        {/* If canvas is loaded () */}
        {!(Username==="") ? <PlayArea username={Username}/> : <div className="col-8"></div>}
        <MessageArea messages={messages} setMessages={setMessages}/>
      </div>
      {(Username==="") && <Popup setUsername={setUsername}/>}
    </div>
  );
}

export default App;
