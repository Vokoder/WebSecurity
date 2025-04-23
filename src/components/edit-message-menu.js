import React from "react"

const Menu = (props) => {
    // editMessageTrigger={props.editMessage}
    return (
        <>
            <div
                className="col-12"
                onClick={() => { alert(123) }}>
                редактировать
            </div>
            <div
                className="col-12"
                onClick={() => { }}
            >
                удалить
            </div>
            <div
                className="col-12"
                onClick={() => { }}
            >
                отмена
            </div>
        </>
    )
}

export default Menu