console.log("Server started")

const temp = [
    {
        id: 1,
        username: "username",
        data: "13.04.2005 13:40",
        edited: false,
        message: "some text",
    },
    {
        id: 2,
        username: "user nickname",
        data: "27.10.2005 5:13",
        edited: true,
        message: "ttteeexxxtttsdfgdfghydfgh dfghuidfghseo88gshgs 87ghsogsdhuighsdg uisrtytvwe78obtywenv78gttteeexxxttts dfgdfghydfghdfghuidfghseo88gshgs87 ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfg hydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtyw env78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhui fgdgsdgdfshdgsdzghjyfghfhdgsfgshdjgnfsdhtjgnbvfrthfhjngfbvdfrthfjgnvbcdfsrgthfgbcvsdfghfgfddghfghigushervteroisuvgnhser8buigebshdvguiesdhvgndsfyuigvhnsrbt87seruivghni ghsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo8 8gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeex xxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78g",
    },
    {
        id: 3,
        username: "my login is bad",
        data: "29.01.2017 13:40",
        edited: false,
        message: "my message is s beatifull)))",
    },
    {
        id: 4,
        username: "user nickname",
        data: "29.01.2017 13:42",
        edited: false,
        message: "test",
    },
]

const WebSocket = require('ws');
const server = new WebSocket.Server({ host: "127.0.0.1", port: 8080 });

server.on('connection', socket => {
    socket.on('message', message => {
        const response = getResponse(message, socket);
        socket.send(response);
    });
});

function getResponse(messageString, socket) {
    let response = {
        username: null,
        responseCode: null,
        messages: temp,
    }

    try {
        message = JSON.parse(messageString)
        console.log(message)
    } catch {
        response.responseCode = "request is not a JSON"
        return response
    }

    if (message.type != undefined) {
        response.requestType = message.type
    } else {
        response.responseCode = "request does not contain request type"
        return response
    }

    switch (message.type) {
        case "is authorised":
            response.responseCode = "ok"
            if (socket.username != undefined) {
                response.username = socket.username
            }
            response.username = "user nickname"//
            break;
        case "log in":

            break;
        case "log out":

            break;
        case "register":

            break;
        case "send":

            break;
        case "edit":

            break;
        case "delete":

            break;
        default:
            response.responseCode = "request type is incorrect"
            break;
    }
    return JSON.stringify(response);
}


// server.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(outgoing);
//     }
//   });