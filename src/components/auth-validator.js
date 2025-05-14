const Validate = (ThrowExeption, login, password, confirmPassword=password) => {
    login = login.trim()
    password = password.trim()
    if (!login || !password) {
        ThrowExeption("Поля не должны быть пустыми")
        return false
    }
    if (/[!@#$%^&*+[\]:;,.?~\\/{}<>]/.test(login)) {
        ThrowExeption("Символы \"!@#$%^&*+[]:;,.?~\\/{}<>\" запрещено использовать в имени пользователя")
        return false
    }
    if (password.length < 8) {
        ThrowExeption("Минимальная длина пароля - 8 символов")
        return false
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        ThrowExeption("В пароле должны быть как буквы, так и цифры")
        return false
    }
    if (!/[!@#$%^&*()_+[\]:;,.?~\\/{}<>-]/.test(password)) {
        ThrowExeption("Пароль должен содержать хотя бы один спец. символ")
        return false
    }
    if (password !== confirmPassword) {
        ThrowExeption("Пароли не совпадают")
        return false
    }
    
    ThrowExeption(null)
    return true
}

export default Validate