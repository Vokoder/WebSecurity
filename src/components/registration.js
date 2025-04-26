import React, { useState } from "react"
import LoginPassword from "./login-password-form-part"

const Form = (formClassName) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const RegistrationClick = (event) => {
        event.preventDefault()
        alert(`${login} ${password} ${confirmPassword}`)
        //валидация данных. В случае провала - ThrowException, иначе вызвать обработчик из App
    }

    const ThrowExeption = () => {
        alert("exception")
        //вывод неверного ввода на экран
    }

    const rowClass = "row p-0 my-1 w-100 mx-0"

    return (<form className={formClassName.formClassName} onSubmit={RegistrationClick}>
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
        <div className={rowClass + " my-3"}>
            <input type="submit" value="Войти" />
        </div>
    </form>)
}


const Registration = (promp) => {
    return (<div className={promp.className ? promp.className : ""}>
        <Form formClassName={promp.formClassName ? promp.formClassName : ""} />
    </div>)
}

export default Registration