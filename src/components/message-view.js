import React from "react"

const Message = (props) => {
    return (
        <div className="row w-100 h-100 p-1 m-0">
            <div className="message-secondary-text col-12"><em>{props.message.username}</em></div>
            <div className="col-12 py-1">{props.message.message}</div>
            {/* <div className="col-12">{`${props.message.edited ? "редактировалось" : ""} ${props.message.data}`}</div> */}
            <div className={`message-secondary-text ${!props.message.edited === true && "d-none"} col-6 text-start`}><em>изменялось</em></div>
            <div className={`message-secondary-text col-${props.message.edited ? "6" : "12"} text-end`}><em>{props.message.data}</em></div>
        </div>
    )
}

export default Message