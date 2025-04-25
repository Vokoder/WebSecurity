import React from "react"
import Message from "./message"

const Chat = (props) => {
    return <div className={props.className}>
        <Message message={props.messages[0]} username={props.username} messageFunctions={props.messageFunctions} />
        <Message message={props.messages[1]} username={props.username} messageFunctions={props.messageFunctions} />
        <Message message={props.messages[2]} username={props.username} messageFunctions={props.messageFunctions} />
        <Message message={props.messages[3]} username={props.username} messageFunctions={props.messageFunctions} />
    </div>
}

export default Chat