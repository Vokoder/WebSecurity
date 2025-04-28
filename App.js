console.log("Server started")

hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

const convertMessagesFromDBToJSON = (dbMessages) => {
    let messages = []
    dbMessages.forEach(dbMessage => {
        try {
            let message = {
                id: dbMessage.id,
                username: dbMessage.username,
                data: dbMessage.datetime,
                edited: dbMessage.is_edited,
                message: dbMessage.message,
            }
            messages.push(message)
        } catch (err) {
            console.error(`Ошибка парсинга массива сообщений, полученных из БД, в JSON. Ошибка: ${err}`)
            throw err
        }
    });
    return messages
}

const WebSocket = require('ws');
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'messenger',
    password: 'Jfjfj12j',
    port: 5432,
});

async function sendQueryToDB(query) {
    try {
        const res = await pool.query(query)
        return res.rows
    } catch (err) {
        console.error(`Ошибка выполнения запроса: ${err}`)
        throw err
    }
}

async function sendQueryToDB(query, values) {
    try {
        const res = await pool.query(query, values)
        return res.rows
    } catch (err) {
        console.error(`Ошибка выполнения запроса: ${err}`)
        throw err
    }
}

async function getMessages() {
    const query = `SELECT 
      m.id, 
      to_char(m.datetime AT TIME ZONE 'Europe/Moscow', 'DD.MM.YYYY HH24:MI:SS') AS datetime,
      m.is_edited, 
      m.message, 
      u.username
    FROM public.messages m
    JOIN public.users u ON m.user_id = u.id
  `
    const messagesDB = await sendQueryToDB(query)
    const messages = convertMessagesFromDBToJSON(messagesDB)
    return messages
}







const server = new WebSocket.Server({ host: "127.0.0.1", port: 8080 });

server.on('connection', socket => {
    socket.on('message', async message => {
        const response = await getResponse(message, socket);
        socket.send(response);
    });
});

async function broadcastMessages(server) {
    server.clients.forEach(async client => {
        if (client.readyState === WebSocket.OPEN && client.user_id) {
            let response = {
                responseCode: "ok",
                requestType: "messages",
                messages: await getMessages(),
            }
            client.send(JSON.stringify(response))
        }
    });
}

const setUser = (username, id, socket) => {
    socket.username = username
    socket.user_id = id
}

const dropUser = (socket) => {
    socket.username = undefined
    socket.user_id = undefined
}

async function getResponse(messageString, socket) {
    let response = {
        username: null,
        responseCode: null,
    }

    try {
        message = JSON.parse(messageString)
    } catch {
        response.responseCode = "request is not a JSON"
        return response
    }

    if (message.type != undefined) {
        response.requestType = message.type
    } else {
        response.responseCode = "request does not contain request type"
        return response
    }

    switch (message.type) {
        case "is authorised":
            response.responseCode = "ok"
            if (socket.username !== undefined) {
                response.username = socket.username
                response.messages = await getMessages()
            }
            break;
        case "log in":
            if (message.password && message.username) {
                const password = hashPassword(message.password)
                const query = `SELECT id FROM public.users 
                       WHERE username = $1 AND password = $2`
                const values = [message.username, password]
                const request = await sendQueryToDB(query, values)
                if (request && request.length > 0) {
                    response.responseCode = "ok"
                    response.username = message.username
                    response.messages = await getMessages()
                    setUser(message.username, request[0].id, socket)
                } else {
                    response.responseCode = `auth failed`
                }
            } else {
                response.responseCode = `Required fields are missing. Request type: ${message.type}`
            }
            break;
        case "log out":
            dropUser(socket)
            response.responseCode = "ok"
            break;
        case "register":
            if (message.password && message.username) {
                const query = `SELECT EXISTS (
                                SELECT 1 
                                FROM public.users 
                                WHERE username = $1
                            )`
                const values = [message.username]
                const request = await sendQueryToDB(query, values)
                if (request[0].exists) {
                    response.responseCode = `user with login "${message.username}" alredy exists`
                } else {
                    const password = hashPassword(message.password)
                    const query = `INSERT INTO public.users (username, password)
                                    VALUES ($1, $2)
                                    RETURNING id`
                    const values = [message.username, password]
                    const request = await sendQueryToDB(query, values)
                    if (request && request.length > 0) {
                        response.responseCode = "ok"
                        response.username = message.username
                        response.messages = await getMessages()
                        setUser(message.username, request[0].id, socket)
                    } else {
                        response.responseCode = "database failure"
                    }
                }
            } else {
                response.responseCode = `Required fields are missing. Request type: ${message.type}`
            }
            break;
        case "send":
            if (socket.username && message.message) {
                const query = `INSERT INTO public.messages (datetime, message, user_id)
                                VALUES (NOW(), $1, $2)
                                RETURNING id`
                const values = [message.message, socket.user_id]
                const request = await sendQueryToDB(query, values)
                if (request && request.length > 0) {
                    response.responseCode = "ok"
                    response.username = message.username
                    broadcastMessages(server)
                } else {
                    response.responseCode = "database failure"
                }
            }
            break;
        case "edit":
            if (socket.username && message.message) {
                const query = `UPDATE public.messages
                                SET message = $1, is_edited = true
                                WHERE user_id = $2 AND id = $3`
                const values = [message.message.newMessage, socket.user_id, message.message.id]
                await sendQueryToDB(query, values)
                response.username = socket.username
                response.responseCode = "ok"
                broadcastMessages(server)
            }
            break;
        case "delete":
            if (socket.username && message.messageId) {
                const query = `DELETE FROM public.messages
                                WHERE user_id = $1 AND id = $2`
                const values = [socket.user_id, message.messageId]
                await sendQueryToDB(query, values)
                response.username = socket.username
                response.responseCode = "ok"
                broadcastMessages(server)
            }
            break;
        default:
            dropUser(socket)
            response.responseCode = "request type is incorrect"
            break;
    }

    const responseString = JSON.stringify(response)
    // console.log(`request: "${messageString}" \nresponse: "${responseString}"`)//

    return responseString
}