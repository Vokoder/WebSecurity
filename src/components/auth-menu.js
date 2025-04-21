import React from "react"
import Autorisation from "./autorisation"
import Registration from "./registration"
import "../style/auth-menu.css"

class AuthView extends React.Component {
    render() {
        const auth_element_class = "auth-element col-6 d-flex px-5 py-0 m-0"
        const auth_form_class = "auth-form justify-content-center align-content-center w-100 h-100"

        return (
            <div className="auth-window row d-flex justify-content-center align-items-center">
                <div className="auth-menu row d-flex col-6 p-0 m-0 justify-content-center align-items-center">
                    <Autorisation className={auth_element_class + " border-right"} formClassName={auth_form_class} />
                    <Registration className={auth_element_class + " border-left"} formClassName={auth_form_class} />
                </div>
            </div>
        )
    }
}

export default AuthView