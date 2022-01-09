// const WebSocketServer = require('websocket').server;
// const http     = require('http');
// const PORT = 8991;

// const httpServer = http.createServer(() => {}).listen(PORT);
// const webSocketServer = new WebSocketServer({ httpServer });

// console.log('Starting');

// webSocketServer.on('request', function(request) {
//     console.log('Got Request');
//     const connection = request.accept(null, request.origin);
//     remember(connection);
//     //
//     //connection.sendUTF(JSON.stringify({ board, current }));
//     connection.sendUTF('Hello');

//     connection.on('message', function(message) {
//         if (message.type === 'utf8')
//             process(JSON.parse(message.utf8Data));
//         else
//             console.log('Unsupported message type: '+message.type);
//     });
//     connection.on('close', function(connection) { forget(connection);});
// });

// function process(message) {
//     switch(message.command) {
//     case 'register':
//         if ('nick' in message && 'pass' in message)
//             console.log('nick: '+message.nick+' pass: '+message.pass);
//         broadcast('Hello');
//         break;
//     default:
//         console.log('Invalid command: '+message.command);
//     }    
// }

// let connections = [];

// function remember(connection) {
//     connections.push(connection);
// }
// function forget(connection) {
//     let pos = connections.findIndex((conn) => conn === connection);

//     if(pos > -1)
//         connections.splice(pos,1);
// }
// function broadcast(data) {
//     let json = JSON.stringify(data);

//     for(let connection of connections) {
//         connection.sendUTF(json);
//     }
// }


const http = require('http');

const server = http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*'); //
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    response.setHeader('Access-Control-Allow-Credentials', true); // If needed
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Olá mundo\n');
    response.end();
    console.log(request.body);
});

server.listen(8991);