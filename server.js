const express = require('express');
const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    // res.send('<h1>Hello world</h1>');
    res.sendFile(join(__dirname, 'index.html'));
})

io.on('connection', (socket) => {
    console.log('A User connected');
})

server.listen(3000, () => {
    console.log(`Server is running, you better catch it!`);
})