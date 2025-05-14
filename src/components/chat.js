import React, { useEffect, useState, useRef } from "react"
import Message from "./message"

const Chat = (props) => {
    const [messagesArray, setMessagesArray] = useState()
    const endOfMessagesRef = useRef(null);

    const parseDate = (dateStr) => {
        const [datePart, timePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split(".");
        const [hour, minute, second] = timePart.split(":");
        return new Date(year, month - 1, day, hour, minute, second);
    };

    useEffect(() => {
        let messages = null;
        if (props.messages !== undefined) {
            messages = props.messages
                .sort((a, b) => {
                    const dateA = parseDate(a.data);
                    const dateB = parseDate(b.data);
                    return dateA - dateB;
                })
                .map((message) => {
                    return <Message
                        message={message}
                        username={props.username}
                        messageFunctions={props.messageFunctions}
                        key={message.id}
                    />
                })
        }
        setMessagesArray(messages)
        // eslint-disable-next-line
    }, [props.messages])

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messagesArray]);

    return <div className={props.className}>
        {messagesArray}
        <div ref={endOfMessagesRef} />
    </div>
}

export default Chat