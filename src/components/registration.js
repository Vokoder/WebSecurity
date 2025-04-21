import React from "react"

const registrationClick = () => {
    alert(1)
}

const Form = (formClassName) => {
    const rowClass = "row p-0 my-1 w-100 mx-0"

    return (<form className={formClassName.formClassName} onSubmit={registrationClick}>
        <div className={rowClass}>
            <label className="p-0 m-0" for="registration-login">
                Введите логин
            </label>
            <input type="text" placeholder="login" className="col-12 p-0" name="registration-login" required />
        </div>

        <div className={rowClass}>
            <label className="p-0 m-0" for="registration-password">
                Введите пароль
            </label>
            <input type="password" placeholder="password" className="col-12 p-0" name="registration-password" required />
        </div>

        <div className={rowClass}>
            <label className="p-0 m-0" for="registration-confirm-password">
                Повторите пароль
            </label>
            <input type="password" placeholder="password" className="col-12 p-0" name="registration-confirm-password" required />
        </div>
        <div className={rowClass + " my-3"}>
            <input type="submit" value="Войти" />
        </div>
    </form>)
}


const registration = (promp) => {
    return (<div className={promp.className ? promp.className : ""}>
        <Form formClassName={promp.formClassName ? promp.formClassName : ""} />
    </div>)
}

export default registration