import React, { useState, useEffect } from "react"
import Autorisation from "./components/autorisation"
import Registration from "./components/registration"

const AuthScreen = (props) => {
    const auth_form_class = "auth-form justify-content-center align-content-center w-100 h-100"
    const [actualForm, setActualForm] = useState(1);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 576);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 576);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="auth-window row d-flex justify-content-center align-items-center">
            <div className="auth-menu row d-flex col-12 col-md-10 col-lg-8 col-xl-6 p-0 m-0 justify-content-center align-items-center">
                {isSmallScreen ? (
                    <>
                        {actualForm === 1 ? (
                            <Autorisation
                                className="auth-element col-12 d-flex px-3 px-sm-5 py-0 m-0"
                                formClassName={auth_form_class}
                                authFunctions={props.authFunctions}
                                toggleLink={{
                                    text: "Нет аккаунта? Зарегистрирутесь",
                                    onClick: () => setActualForm(2)
                                }}
                            />
                        ) : (
                            <Registration
                                className="auth-element col-12 d-flex px-3 px-sm-5 py-0 m-0"
                                formClassName={auth_form_class}
                                authFunctions={props.authFunctions}
                                toggleLink={{
                                    text: "Есть аккаунт? Авторизируйтесь",
                                    onClick: () => setActualForm(1)
                                }}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <Autorisation
                            className="auth-element col-12 col-sm-6 d-flex px-3 px-sm-5 py-0 m-0 border-right"
                            formClassName={auth_form_class}
                            authFunctions={props.authFunctions}
                        />
                        <Registration
                            className="auth-element col-12 col-sm-6 d-flex px-3 px-sm-5 py-0 m-0 border-left"
                            formClassName={auth_form_class}
                            authFunctions={props.authFunctions}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthScreen