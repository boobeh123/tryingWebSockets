const express = require('express');
const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    // res.send('<h1>Hello world</h1>');
    res.sendFile(join(__dirname, 'index.html'));
})

io.on('connection', (socket) => {

    console.log('A User connected');    // displays in terminal on each GET request to '/' route
    io.emit('chat event', 'A User connected');  // displays on browser on the 'chat event' channel
    
    // io.emit('hello', 'world')    // I do not see hello or world emitted
    // socket.broadcast.emit('hi'); // The broadcast flag can send a message to everyone except for a certain emitting socket


    socket.on('chat message', (message) => {
        console.log('message: ' + message); // displays the received input's value in the terminal when the form is submitted
        io.emit('chat message', message);   // displays the received input's value on the browser
        // socket.broadcast.emit('hello')   // I do not see 'hello' emitted when submitting the form
    })
    
    socket.on('disconnect', () => {
        console.log('A User disconnected'); // displays in terminal when user closes (their browser) connection
        io.emit('chat event', "A User disconnected");   // displays in the browser
    });


})

server.listen(3000, () => {
    console.log(`Server is running, you better catch it!`);
})