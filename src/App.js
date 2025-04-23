import React, { useState } from "react"
import Auth from "./Auth-screen"
import Chat from "./Chat-screen"

const App = () => {
    const [username, setUsername] = useState(null)
    const [messages, setMessages] = useState(null)
    const isEditingMode = false

    const dropUsername = () => {
        setUsername(null)
    }

    const sendMessage = (message) => {
        alert(isEditingMode)
        if (isEditingMode) {

            isEditingMode = false
        } else {

        }
    }

    const editMessage = (value) => {
        if (typeof(isEditingMode) === "boolean") {
            isEditingMode = value
        }
    }

    //использование useEffect для изменения окна?

    return (
        <div className="d-flex justify-content-center">
            {username && <Chat username={username} dropUsername={dropUsername} sendMessage={sendMessage} editMessageTrigger={editMessage} />}
            {!username && <Auth temp={setUsername} />}
        </div>
    )
}

export default App