import React, { useState } from "react"
import Auth from "./Auth-screen"
import Chat from "./Chat-screen"

const App = () => {
    const [username, setUsername] = useState(null)
    const [messages, setMessages] = useState(null)

    const dropUsername = () => {
        setUsername(null)
    }

    //использование useEffect для изменения окна?

    return (
        <div className="d-flex justify-content-center">
            {username && <Chat username={username} dropUsername={dropUsername} />}
            {!username && <Auth temp={setUsername}/>}
        </div>
    )
}

export default App