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

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'messenger',
    password: 'Jfjfj12j',
    port: 5432,
});

async function sendQueryToDB(query, values = []) {
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

module.exports.sendQueryToDB = sendQueryToDB
module.exports.getMessages = getMessages