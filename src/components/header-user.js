import React, { useEffect, useState } from "react"

const User = (props) => {
    const [username, setUsername] = useState(props.username)

    const showExit = () => {
        setUsername("Выйти")
    }

    const showUsername = () => {
        setUsername(props.username)
    }

    return (
        <button
            onMouseEnter={() => { showExit() }}
            onMouseLeave={() => { showUsername() }}
            onClick={() => { props.dropUsername() }}
            className="user-logout-button"
        >
            {username}
        </button>
    )
}

export default User