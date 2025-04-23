import React, { useState } from "react"

const Input = (props) => {
    const [message, setMessage] = useState()

    return (
        <div className={props.className}>
            <input
                type="text"
                placeholder="сообщение"
                className="chat-input col-10 py-0 m-1 h-75"
                value={message}
                onChange={
                    (event) => {
                        setMessage(event.target.value)
                    }
                }
            />
            <button
                className="send-message-button col-1 p-0 m-1 h-75 text-truncate"
                onClick={
                    () => {
                        props.sendMessage(message)
                        setMessage("")
                    }
                }
            >
                отправить
            </button>
        </div>
    )
}

export default Input