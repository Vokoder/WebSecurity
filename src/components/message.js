import React, { useState } from "react"
import EditMessage from "./edit-message-menu"
import MessageView from "./message-view"

const Message = (props) => {
    const isMy = props.username === props.message.username
    const message = <MessageView message={props.message} />
    const editMessage = <EditMessage />
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
        if (isMy) { setIsEditing((prev) => !prev); }
    };

    return (
        <div
            onClick={() => { handleClick() }}
            className={`message ${isMy ? "my" : "others"} col-4 row text-break my-2 mx-2`}
        >
            {isEditing ? editMessage : message}
        </div>
    )
}

export default Message