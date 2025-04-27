<?
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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

    // Проверка на новое подключение
    if (in_array($socket, $changed)) {
        $socket_new = socket_accept($socket);
        if ($socket_new === false) {
            continue;
        }
        $clients[] = $socket_new;

        // Выполняем handshake на новом соединении
        $header = socket_read($socket_new, 1024);
        perform_handshake($header, $socket_new);
        socket_getpeername($socket_new, $ip);
        echo "Новое соединение: $ip\n";

        // Убираем основной сокет из массива изменённых, чтобы не обрабатывать его далее
        $index = array_search($socket, $changed);
        unset($changed[$index]);
    }

    // Обработка сообщений от всех подключенных клиентов
    foreach ($changed as $client_socket) {
        // Пытаемся прочитать данные клиента
        $bytes = @socket_recv($client_socket, $buffer, 2048, 0);

        if ($bytes === false || $bytes === 0) {
            socket_getpeername($client_socket, $ip);
            echo "Клиент $ip отключился.\n";
            removeClient($client_socket, $clients, $users);
            continue;
        }

        // $decoded_text = unmask($buffer);
        $decoded_text = $buffer;    //
        $msg = json_decode($decoded_text, true);

        // Если декодирование не удалось, пропускаем сообщение
        if (!$msg) continue;

        processMessage($client_socket, $msg, $clients, $users);
    }
}

socket_close($socket);


/* ================= ФУНКЦИИ ================= */

function perform_handshake($header, $client_sock) {
    // Извлекаем ключ для handshake из заголовков
    preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $header, $matches);
    $key = trim($matches[1]);
    // Вычисляем accept-ключ по стандарту: SHA1+базовое кодирование
    // Cпецификация RFC 6455 для WebSocket соединения.
    $acceptKey = base64_encode(pack('H*', sha1($key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
    $upgrade = "HTTP/1.1 101 Switching Protocols\r\n" .
               "Upgrade: websocket\r\n" .
               "Connection: Upgrade\r\n" .
               "Sec-WebSocket-Accept: $acceptKey\r\n\r\n";
    socket_write($client_sock, $upgrade, strlen($upgrade));
}

// /**
//  * Упаковывает (маскирует) текстовое сообщение согласно протоколу WebSocket.
//  *
//  * @param string $text Исходное сообщение.
//  * @return string Упакованное сообщение для отправки.
//  */
// function mask($text) {
//     $b1 = 0x81; // FIN + текстовый фрейм
//     $length = strlen($text);
//     if ($length <= 125) {
//         $header = pack('CC', $b1, $length);
//     } elseif ($length <= 65535) {
//         $header = pack('CCn', $b1, 126, $length);
//     } else {
//         // Для очень длинных сообщений
//         $header = pack('CCNN', $b1, 127, $length);
//     }
//     return $header . $text;
// }

// /**
//  * Распаковывает (удаляет маску) полученное сообщение.
//  *
//  * @param string $text Полученные данные.
//  * @return string Распакованное текстовое сообщение.
//  */
// function unmask($text) {
//     $length = ord($text[1]) & 127;
//     if ($length === 126) {
//         $masks = substr($text, 4, 4);
//         $data = substr($text, 8);
//     } elseif ($length === 127) {
//         $masks = substr($text, 10, 4);
//         $data = substr($text, 14);
//     } else {
//         $masks = substr($text, 2, 4);
//         $data = substr($text, 6);
//     }
//     $text = "";
//     for ($i = 0, $len = strlen($data); $i < $len; ++$i) {
//         $text .= $data[$i] ^ $masks[$i % 4];
//     }
//     return $text;
// }

function processMessage($client_socket, $msg, &$clients, &$users) {
    switch ($msg['type']) {
        case 'auth':
            $username = $msg['username'];
            $password = hash('sha256', $msg['password']);   //  хэшируем для хранения и сравнения
            // Здесь следует проверить логин/пароль (этот пример всегда разрешает)
            $users[(int)$client_socket] = $username;
            $response = [
                "type" => "auth",
                "status" => "success",
                "message" => "Авторизация успешна",
                "username" => $username
            ];
            // socket_write($client_socket, mask(json_encode($response)), strlen(mask(json_encode($response))));
            socket_write($client_socket, json_encode($response), strlen(json_encode($response)));
            break;

        case 'reg':
            $username = $msg['username'];
            $password = hash('sha256', $msg['password']);   //  хэшируем для хранения и сравнения
            // Пример: всегда успешная регистрация
            $users[(int)$client_socket] = $username;
            $response = [
                "type" => "reg",
                "status" => "success",
                "message" => "Регистрация успешна",
                "username" => $username
            ];
            // socket_write($client_socket, mask(json_encode($response)), strlen(mask(json_encode($response))));
            socket_write($client_socket, json_encode($response), strlen(json_encode($response)));
            break;

        case 'send':
            if (!isset($users[(int)$client_socket])) {
                $response = [
                    "type"      => "error",
                    "username"  => "none",
                    "message"   => "not authorised",
                    "timestamp" => time()
                ];
                socket_write($client_socket, json_encode($response), strlen(json_encode($response)));
                continue;
            }

            $username = $users[(int)$client_socket];
            $chat_message = $msg['message'];
            $response = [
                "type"      => "send",
                "username"  => $username,
                "message"   => $chat_message,
                "timestamp" => time()
            ];
            // Бродкаст всем клиентам (в том числе и отправителю)
            foreach ($clients as $client) {
                // @socket_write($client, mask(json_encode($response)), strlen(mask(json_encode($response))));
                @socket_write($client, json_encode($response), strlen(json_encode($response)));
            }
            break;

        case 'edit':
            $messageId = $msg['id'];
            $newMessage = $msg['message'];
            $response = [
                "type"      => "edit",
                "id"        => $messageId,
                "newMessage"=> $newMessage
            ];
            foreach ($clients as $client) {
                // @socket_write($client, mask(json_encode($response)), strlen(mask(json_encode($response))));
                @socket_write($client, json_encode($response), strlen(json_encode($response)));
            }
            break;

        case 'delete':
            $messageId = $msg['id'];
            $response = [
                "type" => "delete",
                "id"   => $messageId
            ];
            foreach ($clients as $client) {
                // @socket_write($client, mask(json_encode($response)), strlen(mask(json_encode($response))));
                @socket_write($client, json_encode($response), strlen(json_encode($response)));
            }
            break;

        default:
            $response = [
                "type"    => "error",
                "message" => "Неизвестный тип сообщения"
            ];
            // socket_write($client_socket, mask(json_encode($response)), strlen(mask(json_encode($response))));
            socket_write($client_socket, json_encode($response), strlen(json_encode($response)));
            break;
    }
}

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