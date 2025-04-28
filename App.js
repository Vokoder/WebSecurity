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
// const dbRequests = require('./dbRequests')

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
      m.datetime, 
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
            // response.username = "user nickname"//
            break;
        case "log in":
            if (message.password && message.username) {
                const password = hashPassword(message.password)
                const query = `SELECT EXISTS (
                                SELECT 1 
                                FROM public.users 
                                WHERE username = $1 AND password = $2
                            )`
                const values = [message.username, password]
                const request = await sendQueryToDB(query, values)
                if (request[0].exists) {
                    response.responseCode = "ok"
                    response.username = message.username
                    response.messages = await getMessages()
                    socket.username = message.username
                } else {
                    response.responseCode = `auth failed`
                }
            } else {
                response.responseCode = `Required fields are missing. Request type: ${message.type}`
            }
            break;
        case "log out":
            socket.username = undefined
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
                                    RETURNING username
                    `
                    const values = [message.username, password]
                    const request = await sendQueryToDB(query, values)
                    if (request[0].username) {
                        response.responseCode = "ok"
                        response.username = request[0].username
                        response.messages = await getMessages()
                        socket.username = request[0].username
                    } else {
                        response.responseCode = "database failure"
                    }
                }
            } else {
                response.responseCode = `Required fields are missing. Request type: ${message.type}`
            }
            break;
        case "send":

            break;
        case "edit":

            break;
        case "delete":

            break;
        default:
            response.responseCode = "request type is incorrect"
            break;
    }

    const responseString = JSON.stringify(response)
    console.log(`request: "${messageString}" \nresponse: "${responseString}"`)//

    return responseString
}

// server.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(outgoing);
//     }
//   });