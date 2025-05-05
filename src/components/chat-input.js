import React, { useEffect, useState } from "react"
import sendIcon from "../icons/send-icon.png"
import cancelIcon from "../icons/cancel-icon.png"

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
                className={`chat-input ${isEditingMode ? "col-8" : "col-9"} ${isEditingMode ? "col-sm-10" : "col-sm-11"} ${isEditingMode ? "col-md-10" : "col-md-11"} col-xl-11 py-0 m-1 h-75`}
                value={message}
                onChange={
                    (event) => {
                        setMessage(event.target.value)
                    }
                }
            />
            <button
                className="send-message-button col-1 p-0 m-1 text-truncate d-flex justify-content-center"
                onClick={
                    () => {
                        isEditingMode ? props.messageFunctions.editMessage(message) : props.messageFunctions.sendMessage(message)
                        setMessage("")
                    }
                }
            >
                {/* {isEditingMode ? "изменить" : "отправить"} */}
                <img src={sendIcon} alt="Send" className="p-0 m-0 w-75 h-75 align-self-center"/>
            </button>
            <button
                className={`message-abort-editing-button col-1 p-0 m-1 text-truncate ${isEditingMode ? "d-flex" : "d-none"} justify-content-center`}
                onClick={() => { abortEditing() }}
            >
                <img src={cancelIcon} alt="Cancel" className="p-0 m-0 w-75 h-75 align-self-center"/>
            </button>
        </div>
    )
}

export default Input