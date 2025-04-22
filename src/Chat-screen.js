import React from "react"
import Header from "./components/header"
import Chat from "./components/chat"
import "./style/chat.css"

const ChatScreen = (props) => {

    return (
        <div className="chat-screen row d-flex">
            <Header className="col-12 header d-flex justify-content-between" username={props.username} dropUsername={props.dropUsername}/>
            <Chat className="col-12 chat"/>
        </div>
    )
}

export default ChatScreen