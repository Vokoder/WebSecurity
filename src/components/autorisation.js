import React, { useState } from "react"
import LoginPassword from "./login-password-form-part"

const Form = (formClassName) => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const AutorisationClick = (event) => {
        event.preventDefault()
        alert(`${login} ${password}`)
        //валидация данных. В случае провала - ThrowException, иначе вызвать обработчик из App
        return false
    }
    
    const ThrowExeption = () => {
        alert("exception")
        //вывод неверного ввода на экран
    }

    const rowClass = "row p-0 my-1 w-100 mx-0"

    return (<form className={formClassName.formClassName} onSubmit={AutorisationClick}>
        <LoginPassword
            rowClass={rowClass}
            login={login}
            setLogin={setLogin}
            password={password}
            setPassword={setPassword}
        />
        <div className={rowClass + " my-3"}>
            <input type="submit" value="Войти" />
        </div>
    </form>)
}

const Autorisation = (promp) => {
    return (<div className={promp.className ? promp.className : ""} >
        <Form formClassName={promp.formClassName ? promp.formClassName : ""} />
    </div >)
}

export default Autorisation