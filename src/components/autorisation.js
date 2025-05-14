import React, { useState } from "react"
import LoginPassword from "./login-password-form-part"
import authValidator from "./auth-validator"

const Form = (props) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [exception, setException] = useState(null)

    const AutorisationClick = (event) => {
        event.preventDefault()
        setLogin(login.trim())
        setPassword(password.trim())
        if (!authValidator(ThrowExeption, login, password)) {
            return
        }
        if (props.authFunctions.logIn(ThrowExeption, login, password)) {
            setException(null)
        }

        //валидация данных. В случае провала - ThrowException, иначе вызвать обработчик из App
    }

    const ThrowExeption = (errorMessage) => {
        setException(errorMessage)
    }

    const rowClass = "row p-0 my-1 w-100 mx-0"

    return (<form className={props.formClassName} onSubmit={AutorisationClick}>
        <div className="text-center h5 py-1">Авторизация</div>
        <LoginPassword
            rowClass={rowClass}
            login={login}
            setLogin={setLogin}
            password={password}
            setPassword={setPassword}
        />
        <div className={`${rowClass} ${exception == null && "d-none"} exception`}>
            <em>
                {exception}
            </em>
        </div>
        <div className={`${rowClass} my-3`}>
            <input type="submit" value="Войти" />
        </div>
        {props.toggleLink && (
            <div className="toggle-auth-container">
                <button
                    type="button"
                    className="toggle-auth-text"
                    onClick={props.toggleLink.onClick}
                >
                    {props.toggleLink.text}
                </button>
            </div>
        )}
    </form>)
}

const Autorisation = (props) => {
    return (<div className={props.className ? props.className : ""} >
        <Form
            formClassName={props.formClassName ? props.formClassName : ""}
            authFunctions={props.authFunctions}
            toggleLink={props.toggleLink}
        />
    </div >)
}

export default Autorisation