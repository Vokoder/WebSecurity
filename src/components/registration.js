import React, { useState } from "react"
import LoginPassword from "./login-password-form-part"
import authValidator from "./auth-validator"

const Form = (props) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [exception, setException] = useState(null)

    const RegistrationClick = (event) => {
        event.preventDefault()
        setLogin(login.trim())
        setPassword(password.trim())
        setConfirmPassword(confirmPassword.trim())
        if (!authValidator(ThrowExeption, login, password, confirmPassword)) {
            return
        }
        if (props.authFunctions.register(ThrowExeption, login, password)) {
            setException(null)
        }

        //валидация данных. В случае провала - ThrowException, иначе вызвать обработчик из App
    }

    const ThrowExeption = (errorMessage) => {
        setException(errorMessage)
    }

    const rowClass = "row p-0 my-1 w-100 mx-0"

    return (<form className={props.formClassName} onSubmit={RegistrationClick}>
        <div className="text-center h5 py-1">Регистрация</div>
        <LoginPassword
            rowClass={rowClass}
            login={login}
            setLogin={setLogin}
            password={password}
            setPassword={setPassword}
        />
        <div className={rowClass}>
            <label className="p-0 m-0" htmlFor="registration-confirm-password">
                Повторите пароль
            </label>
            <input
                type="password"
                placeholder="password"
                className="col-12 p-0"
                name="registration-confirm-password"
                required
                value={confirmPassword}
                onChange={
                    (event) => {
                        setConfirmPassword(event.target.value)
                    }
                }
            />
        </div>
        <div className={`${rowClass} ${exception == null && "d-none"} exception`}>
            <em>
                {exception}
            </em>
        </div>
        <div className={rowClass + " my-3"}>
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


const Registration = (props) => {
    return (<div className={props.className ? props.className : ""}>
        <Form
            formClassName={props.formClassName ? props.formClassName : ""}
            authFunctions={props.authFunctions}
            toggleLink={props.toggleLink}
        />
    </div>)
}

export default Registration