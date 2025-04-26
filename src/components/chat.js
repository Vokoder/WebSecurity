import React, { useEffect, useState } from "react"
import Message from "./message"

const Chat = (props) => {
    const [messagesArray, setMessagesArray] = useState()
    useEffect(() => {
        const messages = props.messages.map((message) =>
            <Message message={message} username={props.username} messageFunctions={props.messageFunctions} key={message.id} />
        )
        setMessagesArray(messages)
    }, [props.messages])

    return <div className={props.className}>
        {messagesArray}
    </div>
}

export default Chat