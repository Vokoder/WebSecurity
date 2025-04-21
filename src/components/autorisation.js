import React from "react"

const autorisationClick = () => {
    alert(1)
}

const throwExeption = () => {
    alert("exception")
}

const Form = (formClassName) => {
    const rowClass = "row p-0 my-1 w-100 mx-0"

    return (<form className={formClassName.formClassName} onSubmit={autorisationClick}>
        <div className={rowClass}>
            <label className="p-0 m-0" for="autorisation-login">
                Введите логин
            </label>
            <input type="text" placeholder="login" className="col-12 p-0" name="autorisation-login" required />
        </div>

        <div className={rowClass}>
            <label className="p-0 m-0" for="autorisation-password">
                Введите пароль
            </label>
            <input type="password" placeholder="password" className="col-12 p-0" name="autorisation-password" required />
        </div>
        <div className={rowClass + " my-3"}>
            <input type="submit" value="Войти" />
        </div>
    </form>)
}

const autorisation = (promp) => {
    return (<div className={promp.className ? promp.className : ""} >
        <Form formClassName={promp.formClassName ? promp.formClassName : ""} />
    </div >)
}

export default autorisation