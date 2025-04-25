import React, { useState } from "react"
import Auth from "./Auth-screen"
import ChatScreen from "./Chat-screen"

const App = () => {
    const [username, setUsername] = useState(null)
    const [messages, setMessages] = useState([
        {
            id: 1,
            username: "username",
            data: "13.04.2005 13:40",
            edited: false,
            message: "some text",
        },
        {
            id: 2,
            username: "user nickname",
            data: "27.10.2004 5:13",
            edited: true,
            message: "ttteeexxxtttsdfgdfghydfgh dfghuidfghseo88gshgs 87ghsogsdhuighsdg uisrtytvwe78obtywenv78gttteeexxxttts dfgdfghydfghdfghuidfghseo88gshgs87 ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfg hydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtyw env78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhui fgdgsdgdfshdgsdzghjyfghfhdgsfgshdjgnfsdhtjgnbvfrthfhjngfbvdfrthfjgnvbcdfsrgthfgbcvsdfghfgfddghfghigushervteroisuvgnhser8buigebshdvguiesdhvgndsfyuigvhnsrbt87seruivghni ghsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo8 8gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeex xxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78g",
        },
        {
            id: 3,
            username: "my login is bad",
            data: "29.01.2017 13:40",
            edited: false,
            message: "my message is s beatifull)))",
        },
        {
            id: 4,
            username: "user nickname",
            data: "29.01.2017 13:40",
            edited: false,
            message: "test",
        },
    ])
    const [messageForEdit, setMessageForEdit] = useState(null)
    /// null if nothink to edit

    const isEditingMode = false

    const dropUsername = () => {
        setUsername(null)
    }

    const sendMessage = (message) => {
        if (message.trim()) {
            alert(`${message} отправлено`)
        }
        //
    }

    const editMessage = (message) => {
        setMessageForEdit(null)
        //
    }

    const deleteMessage = (message) => {
        if ((messageForEdit != null) && (messageForEdit.id === message.id)) {
            setMessageForEdit(null)
        }
        alert("delete message")
        //
    }

    const startMessageEditing = (message) => {
        setMessageForEdit(message)
        //can be null for drop message for editing
    }

    //использование useEffect для изменения окна?

    return (
        <div className="d-flex justify-content-center">
            {username && <ChatScreen
                username={username}
                dropUsername={dropUsername}
                messages={messages}
                messageForEdit={messageForEdit}
                messageFunctions={{
                    "sendMessage": sendMessage,
                    "editMessage": editMessage,
                    "deleteMessage": deleteMessage,
                    "startMessageEditing": startMessageEditing,
                }}
            />}
            {!username && <Auth temp={setUsername} />}
        </div>
    )
}

export default App