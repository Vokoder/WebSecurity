import React, { useEffect, useState } from "react"

const Input = (props) => {
    const [message, setMessage] = useState("")
    const [isEditingMode, setEditingMode] = useState(false)
    useEffect(() => {
        if (props.messageForEdit == null) {
            setEditingMode(false)
            setMessage("")
        } else {
            setEditingMode(true)
            setMessage(props.messageForEdit.message)
        }
    }, [props.messageForEdit])

    const abortEditing = () => {
        props.messageFunctions.startMessageEditing(null)
    }

    return (
        <div className={props.className}>
            <input
                type="text"
                placeholder="сообщение"
                className={`chat-input col-10 py-0 m-1 h-75`}
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
                        isEditingMode ? props.messageFunctions.editMessage(message) : props.messageFunctions.sendMessage(message)
                        setMessage("")
                    }
                }
            >
                {isEditingMode ? "изменить" : "отправить"}
            </button>
            <button
                className={`message-abort-editing-button col-1 p-0 m-1 text-truncate ${!isEditingMode && "d-none"}`}
                onClick={() => { abortEditing() }}
            >
                X
            </button>
        </div>
    )
}

export default Input