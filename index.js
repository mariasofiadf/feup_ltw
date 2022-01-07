const http = require('http');

const server = http.createServer(function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*'); //
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    response.setHeader('Access-Control-Allow-Credentials', true); // If needed
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Olá mundo\n');
});

server.listen(9091);