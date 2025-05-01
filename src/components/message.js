import React, { useState } from "react"
import EditMessage from "./edit-message-menu"
import MessageView from "./message-view"

const Message = (props) => {
    const isMy = props.username === props.message.username
    const messageView = <MessageView message={props.message} />
    const editMessage = <EditMessage messageFunctions={props.messageFunctions} message={props.message} />
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
        if (isMy) { setIsEditing((prev) => !prev); }
    };

    return (
        <div className={`d-flex ${isMy ? "justify-content-end" : "justify-content-start"} col-12`}>
            <div
                onClick={() => { handleClick() }}
                className={`message ${isMy ? "my" : "others"} col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 row text-break my-2 mx-0 mx-sm-2 text-start user-select-none`}
            >
                {isEditing ? editMessage : messageView}
            </div>
        </div>
    )
}

export default Message