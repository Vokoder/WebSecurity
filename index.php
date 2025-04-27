<?
//  Request codes
//  is autorised - 1
//  log in - 2
//  register - 3
//  log out - 4
//  send message - 5
//  edit message - 6
//  delete message - 7
//  get messages - 8

// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Origin: *");

// session_start();

// $inputString = file_get_contents('php://input');

// $input = json_decode($inputString);

// if ($input['requesr'] == "")

#!/usr/bin/env php





//  Авторизация (type: "auth")
//  Регистрация (type: "reg")
//  Отправка сообщения (type: "send")
//  Редактирование сообщения (type: "edit")
//  Удаление сообщения (type: "delete")

//  Клиент должен отправлять сообщения в формате JSON, например:
//  { "type": "auth", "username": "user1", "password": "pass" }
//  { "type": "send", "message": "Hello, world!" }

// Параметры сервера (адрес и порт)
$host = '0.0.0.0';
$port = 8080;

$clients = [];  // все открытые соединения
$users = [];    // соответствие socket => username

// Создаем сокет для прослушивания входящих соединений
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die("Не удалось создать сокет\n");
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($socket, $host, $port) or die("Не удалось привязать сокет\n");
socket_listen($socket, 5) or die("Не удалось слушать сокет\n");

// Добавляем основной сокет в список клиентов
$clients[] = $socket;

echo "WebSocket-сервер запущен на $host:$port\n";

// Главный цикл сервера (бесконечный цикл обработки событий)
while (true) {
    // Копируем список соединений для socket_select
    $changed = $clients;
    // Ожидаем событий на сокетах (с таймаутом в 0 секунд + 10 микросекунд)
    socket_select($changed, $null, $null, 0, 10);

    // Если событие произошло на основном сокете, значит, новое подключение
    if (in_array($socket, $changed)) {
        $socket_new = socket_accept($socket);
        if ($socket_new === false) {
            continue;
        }
        $clients[] = $socket_new;

        // Выполняем handshake на новом соединении
        $header = socket_read($socket_new, 1024);
        perform_handshake($header, $socket_new, $host, $port);
        socket_getpeername($socket_new, $ip);
        echo "Новое соединение: $ip\n";

        // Можно уведомить подключившегося клиента о подключении (необязательно)
        $welcome_msg = [
            "type" => "system",
            "message" => "Добро пожаловать на сервер!"
        ];
        $response = mask(json_encode($welcome_msg));
        socket_write($socket_new, $response, strlen($response));

        // Убираем основной сокет из массива изменённых, чтобы не обрабатывать его далее
        $index = array_search($socket, $changed);
        unset($changed[$index]);
    }

    // Обработка сообщений от всех подключенных клиентов
    foreach ($changed as $client_socket) {
        // Пытаемся прочитать данные клиента
        $bytes = @socket_recv($client_socket, $buffer, 2048, 0);

        if ($bytes === false || $bytes === 0) {
            // Если чтение не удалось – клиент отключился.
            socket_getpeername($client_socket, $ip);
            echo "Клиент $ip отключился.\n";
            removeClient($client_socket, $clients, $users);
            continue;
        }

        // Распаковываем полученные данные (удаляем маскировку WebSocket)
        $decoded_text = unmask($buffer);
        // Декодируем JSON-сообщение
        $msg = json_decode($decoded_text, true);

        // Если декодирование не удалось, пропускаем сообщение
        if (!$msg) {
            continue;
        }

        // Обработка сообщения по типу (auth, reg, send, edit, delete)
        processMessage($client_socket, $msg, $clients, $users);
    }
}

// Закрываем основной сокет (в конце работы, хотя цикл бесконечен)
socket_close($socket);





/* ================= ФУНКЦИИ ================= */

/**
 * Выполняет WebSocket handshake согласно протоколу.
 *
 * @param string $header Заголовки запроса клиента.
 * @param resource $client_sock Сокет клиента.
 * @param string $host Хост сервера.
 * @param int $port Порт сервера.
 */
function perform_handshake($header, $client_sock, $host, $port) {
    // Извлекаем ключ для handshake из заголовков
    preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $header, $matches);
    $key = trim($matches[1]);
    // Вычисляем accept-ключ по стандарту: SHA1+базовое кодирование
    $acceptKey = base64_encode(pack('H*', sha1($key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    // Формируем ответ для handshake
    $upgrade = "HTTP/1.1 101 Switching Protocols\r\n" .
               "Upgrade: websocket\r\n" .
               "Connection: Upgrade\r\n" .
               "Sec-WebSocket-Accept: $acceptKey\r\n\r\n";
    socket_write($client_sock, $upgrade, strlen($upgrade));
}

/**
 * Упаковывает (маскирует) текстовое сообщение согласно протоколу WebSocket.
 *
 * @param string $text Исходное сообщение.
 * @return string Упакованное сообщение для отправки.
 */
function mask($text) {
    $b1 = 0x81; // FIN + текстовый фрейм
    $length = strlen($text);
    if ($length <= 125) {
        $header = pack('CC', $b1, $length);
    } elseif ($length <= 65535) {
        $header = pack('CCn', $b1, 126, $length);
    } else {
        // Для очень длинных сообщений
        $header = pack('CCNN', $b1, 127, $length);
    }
    return $header . $text;
}

/**
 * Распаковывает (удаляет маску) полученное сообщение.
 *
 * @param string $text Полученные данные.
 * @return string Распакованное текстовое сообщение.
 */
function unmask($text) {
    $length = ord($text[1]) & 127;
    if ($length === 126) {
        $masks = substr($text, 4, 4);
        $data = substr($text, 8);
    } elseif ($length === 127) {
        $masks = substr($text, 10, 4);
        $data = substr($text, 14);
    } else {
        $masks = substr($text, 2, 4);
        $data = substr($text, 6);
    }
    $text = "";
    for ($i = 0, $len = strlen($data); $i < $len; ++$i) {
        $text .= $data[$i] ^ $masks[$i % 4];
    }
    return $text;
}

/**
 * Обрабатывает входящие сообщения, исходя из их типа.
 *
 * @param resource $client_socket Сокет отправителя.
 * @param array $msg Декодированное сообщение.
 * @param array $clients Список всех подключенных клиентов.
 * @param array &$users Ассоциативный массив socket-идентификатор => username.
 */
function processMessage($client_socket, $msg, &$clients, &$users) {
    // Ожидается, что клиент будет отправлять JSON с ключом "type".
    switch ($msg['type']) {
        /**
         * Авторизация.
         * Ожидается {"type": "auth", "username": "...", "password": "..."}
         * Здесь можно подключить проверку к базе данных.
         */
        case 'auth':
            $username = $msg['username'];
            $password = $msg['password'];
            // Здесь следует проверить логин/пароль (этот пример всегда разрешает)
            $users[(int)$client_socket] = $username;
            $response = [
                "type" => "auth",
                "status" => "success",
                "message" => "Авторизация успешна",
                "username" => $username
            ];
            socket_write($client_socket, mask(json_encode($response)), strlen(mask(json_encode($response))));
            break;

        /**
         * Регистрация.
         * Ожидается {"type": "reg", "username": "...", "password": "..."}
         * В реальном приложении следует добавить пользователя в базу данных.
         */
        case 'reg':
            $username = $msg['username'];
            $password = $msg['password'];
            // Пример: всегда успешная регистрация
            $users[(int)$client_socket] = $username;
            $response = [
                "type" => "reg",
                "status" => "success",
                "message" => "Регистрация успешна",
                "username" => $username
            ];
            socket_write($client_socket, mask(json_encode($response)), strlen(mask(json_encode($response))));
            break;

        /**
         * Отправка сообщения (чат).
         * Ожидается {"type": "send", "message": "текст"}
         * Сообщение транслируется всем подключенным клиентам.
         */
        case 'send':
            // Возьмем имя пользователя из списка, если авторизован, иначе "Anonymous"
            $username = isset($users[(int)$client_socket]) ? $users[(int)$client_socket] : "Anonymous";
            $chat_message = $msg['message'];
            $response = [
                "type"      => "send",
                "username"  => $username,
                "message"   => $chat_message,
                "timestamp" => time()
            ];
            // Бродкаст всем клиентам (в том числе и отправителю)
            foreach ($clients as $client) {
                @socket_write($client, mask(json_encode($response)), strlen(mask(json_encode($response))));
            }
            break;

        /**
         * Редактирование сообщения.
         * Ожидается {"type": "edit", "id": идентификатор, "message": "новый текст"}
         * В данном примере просто транслируем изменение.
         */
        case 'edit':
            $messageId = $msg['id'];
            $newMessage = $msg['message'];
            $response = [
                "type"      => "edit",
                "id"        => $messageId,
                "newMessage"=> $newMessage
            ];
            foreach ($clients as $client) {
                @socket_write($client, mask(json_encode($response)), strlen(mask(json_encode($response))));
            }
            break;

        /**
         * Удаление сообщения.
         * Ожидается {"type": "delete", "id": идентификатор}
         */
        case 'delete':
            $messageId = $msg['id'];
            $response = [
                "type" => "delete",
                "id"   => $messageId
            ];
            foreach ($clients as $client) {
                @socket_write($client, mask(json_encode($response)), strlen(mask(json_encode($response))));
            }
            break;

        default:
            $response = [
                "type"    => "error",
                "message" => "Неизвестный тип сообщения"
            ];
            socket_write($client_socket, mask(json_encode($response)), strlen(mask(json_encode($response))));
            break;
    }
}

/**
 * Удаляет клиента из списка соединений и удаляет его запись из пользователей.
 *
 * @param resource $client_socket Сокет клиента.
 * @param array &$clients Массив всех активных соединений.
 * @param array &$users Массив зарегистрированных пользователей.
 */
function removeClient($client_socket, &$clients, &$users) {
    $index = array_search($client_socket, $clients);
    if ($index !== false) {
        unset($clients[$index]);
    }
    if (isset($users[(int)$client_socket])) {
        unset($users[(int)$client_socket]);
    }
}
?>