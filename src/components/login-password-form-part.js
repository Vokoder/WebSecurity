import React from "react"

const LoginPasswordFormPart = (props) => {
    return <>
        <div className={props.rowClass}>
            <label className="p-0 m-0" htmlFor="autorisation-login">
                Введите логин
            </label>
            <input
                type="text"
                placeholder="login"
                className="col-12 p-0"
                name="autorisation-login"
                required value={props.login}
                onChange={
                    (event) => {
                        props.setLogin(event.target.value)
                    }
                }
            />
        </div>

        <div className={props.rowClass}>
            <label className="p-0 m-0" htmlFor="autorisation-password">
                Введите пароль
            </label>
            <input
                type="password"
                placeholder="password"
                className="col-12 p-0"
                name="autorisation-password"
                required value={props.password}
                onChange={
                    (event) => {
                        props.setPassword(event.target.value)
                    }
                }
            />
        </div>
    </>
}

export default LoginPasswordFormPart