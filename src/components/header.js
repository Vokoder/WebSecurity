import React from "react"
import UserLogoutButton from "./header-user"

const Header = (props) => {
    return (
        <div className={props.className}>
            <h1>Название чата</h1>
            <UserLogoutButton username={props.username} dropUsername={props.dropUsername}/>
        </div>
    )
}

export default Header