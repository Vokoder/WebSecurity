import React, { useEffect, useState } from "react"

const User = (props) => {
    const [username, setUsername] = useState(props.username)

    const showExit = () => {
        setUsername("выйти")
    }

    const showUsername = () => {
        setUsername(props.username)
    }

    return (
        <button
            onMouseEnter={() => { showExit() }}
            onMouseLeave={() => { showUsername() }}
            onClick={() => { props.dropUsername() }}
            className="user-logout-button border-left text-end mx-3 text-truncate"
        >
            <h5 className="m-0">{username}</h5>
        </button>
    )
}

export default User