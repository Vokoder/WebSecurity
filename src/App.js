import React, { useEffect, useState } from "react"
import Auth from "./Auth-screen"
import ChatScreen from "./Chat-screen"

const App = () => {
    const [webSocket, setWebSocket] = useState()
    const [username, setUsername] = useState(null)
    const [messages, setMessages] = useState()
    const [messageForEdit, setMessageForEdit] = useState(null)
    /// null if nothink to edit

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8080")
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "is authorised" }))
        }
        socket.onmessage = (event) => {
            getResponse(event.data)
        };
        setWebSocket(socket)

        return () => {
            socket.close();
        };
        // eslint-disable-next-line
    }, [])

    const sendRequest = (message) => {
        webSocket.send(JSON.stringify(message))
    }

    const getResponse = (responseString) => {
        const response = JSON.parse(responseString)
        console.log(response)

        if (response.responseCode !== undefined
            && response.responseCode !== null
            && response.requestType !== undefined
        ) {
            if (response.responseCode === "ok") {
                if (response.messages !== undefined && response.messages !== null) {
                    setMessages(response.messages)
                }

                switch (response.requestType) {
                    case "messages":
                        break
                    case "is authorised":
                        if (response.username !== undefined) {
                            setUsername(response.username)
                        } else {
                            setUsername(null)
                        }
                        break;
                    case "log in":
                        if (response.username !== null && response.username !== undefined) {
                            setUsername(response.username)
                        } else {
                            throwExeption("ошибка авторизации")
                            setUsername(null)
                        }
                        break;
                    case "log out":
                        if (response.username !== undefined) {
                            setUsername(response.username)
                            response.username !== null && throwExeption("ошибка деавторизации")
                        }
                        break;
                    case "register":
                        if (response.username !== null && response.username !== undefined) {
                            setUsername(response.username)
                        } else {
                            throwExeption("ошибка регистрации")
                            setUsername(null)
                        }
                        break;
                    case "send":
                        break;
                    case "edit":
                        break;
                    case "delete":
                        break;
                    default:
                        throwExeption("получен некорректный ответ от сервера")
                        break;
                }
            } else {
                switch (response.requestType) {
                    case "log in":
                        throwExeption(response.responseCode)
                        break;
                    case "register":
                        throwExeption(response.responseCode)
                        break;
                    default:
                        throwExeption(`получен некорректный ответ от сервера с кодом: "${response.responseCode}`)
                        break;
                }
            }
        }
    }

    const logIn = (ThrowExeption, login, password) => {
        login = login.trim()
        password = password.trim()
        if (login && password) {
            const request = {
                username: login,
                password: password,
                type: "log in",
            }
            sendRequest(request)
        }
    }

    const register = (ThrowExeption, login, password) => {
        login = login.trim()
        password = password.trim()
        if (login && password) {
            const request = {
                username: login,
                password: password,
                type: "register",
            }
            sendRequest(request)
        }
    }

    const dropUsername = () => {
        const request = {
            type: "log out",
        }
        sendRequest(request)
    }

    const sendMessage = (message) => {
        message = message.trim()
        if (message) {
            const request = {
                type: "send",
                message: message,
            }
            sendRequest(request)
        }
    }

    const editMessage = (message) => {
        message = message.trim()
        if (message && messageForEdit !== null
            && messageForEdit !== undefined
            && message !== messageForEdit.message
        ) {
            const request = {
                type: "edit",
                message: {
                    id: messageForEdit.id,
                    newMessage: message,
                },
            }
            sendRequest(request)
        }
        setMessageForEdit(null)
    }

    const deleteMessage = (message) => {
        if (message !== undefined && message !== null) {
            if (messageForEdit !== undefined
                && messageForEdit !== null
                && messageForEdit.id === message.id
            ) {
                setMessageForEdit(null)
            }
            const request = {
                type: "delete",
                messageId: message.id,
            }
            sendRequest(request)
        }
    }

    const startMessageEditing = (message) => {
        setMessageForEdit(message)
        //can be null for drop message for editing
    }

    const throwExeption = (exception) => {
        alert(exception)
    }

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
            {!username && <Auth
                authFunctions={{
                    "logIn": logIn,
                    "register": register,
                }}
            />}
        </div>
    )
}

export default App