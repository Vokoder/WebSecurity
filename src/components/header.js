import React from "react"
import UserLogoutButton from "./header-user"

const Header = (props) => {
    return (
        <div className={props.className}>
            <h5 className="mx-3 my-0 d-none d-sm-flex text-truncate">Корпоративный чат</h5>
            <UserLogoutButton username={props.username} dropUsername={props.dropUsername}/>
        </div>
    )
}

export default Header