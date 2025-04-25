import React from "react"

const Menu = (props) => {
    const editButtonsClass = "edit-message-buttons col-12 user-select-none align-content-center"
    return (
        <div className="row w-100 h-100 text-center p-0 m-0">
            <div
                className={editButtonsClass}
                onClick={() => { props.messageFunctions.startMessageEditing(props.message) }}>
                редактировать
            </div>
            <div
                className={editButtonsClass}
                onClick={() => { props.messageFunctions.deleteMessage(props.message) }}>
                удалить
            </div>
            <div className={editButtonsClass}>
                отмена
            </div>
        </div>
    )
}

export default Menu