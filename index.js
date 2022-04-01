const http = require('http');
const app = require('./app')

const server = http.createServer(app)

server.listen(1008, () => console.log('Server running on port: 1008'))