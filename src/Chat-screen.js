import React from "react"
import Header from "./components/header"
import Chat from "./components/chat"
import Input from "./components/chat-input"
import "./style/chat.css"

const ChatScreen = (props) => {
    return (
        <div className="chat-screen row d-flex">
            <Header
                className="col-12 header d-flex justify-content-between align-items-center"
                username={props.username}
                dropUsername={props.dropUsername}
            />
            <Chat
                className="col-12 chat"
                editMessageTrigger={props.editMessage}
                username={props.username}
            />
            <Input
                className="col-12 input d-flex justify-content-center row align-items-center p-0"
                sendMessage={props.sendMessage}
            />
        </div>
    )
}

export default ChatScreen