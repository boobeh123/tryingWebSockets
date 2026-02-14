var socket = io();

var form = document.querySelector('#form');
var input = document.querySelector('#input');
var messages = document.querySelector('#messages');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
})

socket.on('chat message', function(message) {
    var item = document.createElement('li');

    item.textContent = message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})

socket.on('chat event', function(message) {
    let item = document.createElement('li');

    item.textContent = message;
    item.style.color = 'red';
    item.style.fontStyle = 'bold';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})
// alert('hello world')
/*************************************************************************
* Notes
*************************************************************************/
/* 
I forgot a lot about the process of creating a project from scratch, 
as I started it the process, it starting coming back. 
These notes may help on initializing a project, but is not a how-to. 
It won't hold your hand, but provides (some) guidance
*/

/*************************************************************************
* Initializing project
*************************************************************************/
/*
- Create git repo & Initial commit
- Create a package.json (npm init)
- Install dependencies (express)
- Create server.js
- Run server with command: 'node server.js'
- I forgot how to serve public files (css/js), so styling will be inline.
    - I did spend time to attempt it. It was taking time away from webSockets
- The route handler is using `sendFile` to serve our index.html file vs using a view engine
- Install more dependencies (socket.io)

/*************************************************************************
* Integrating Socket.io
*************************************************************************/
/*
Socket.io is composted of 2 parts:
1) A server that integrates on the NodeJS HTTP Server - socket.io package (not sure if this refers to the module? (npm install socket.io)?)
2) A cleint library that loads on the browser - socket.io-client package (i think this is added as client-side js)

- I will be using inline js as well, because of not serving public files

The code snippet below is added inline to our index.html, ideally should be in a main.js - for learning purposes i am fine w/ this
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
</script>

This snippet above is all it takes to load the socket.io-client

There's no specific URL when I call `io()`, because it defaults to trying to connect to the host that serves the page

Hosting the app that's not the root of the website (e.g., https://astroauction.com/announcements) then we need to specify the path in both the server & the client

If you've reached this point, start the server & open several tabs to this app (localhost:3000)
The terminal should display console logs (A User connected) each time a new client connects (the opening of several tabs to the URL localhost:3000)

/*************************************************************************
* Emitting events
*************************************************************************/
/*
Socket.io can send & receive any event we want, with any data we want

I plan to use this tool to create an "announcement banner" in an existing project

In our index.html, we are using the <script> tag as our main.js / client-side javascript file, due to not serving my public dir to the server
- Within this script tag, are adding an eventlistener to our form element.
- When the form is submitted, 
    - (we prevent the page from refreshing) 
    - We determine if the input element contains a value (string/integers)
        - If it the condition evaluates as true:
            - We use Socket's built-in emit() method to send our input's value to the server as a chat message

In short: When the user types in a message, the server gets it as a chat message event.
Keep in mind: I have not used websockets before, so if something doesn't sound right, let me know

In our server.js:
- We are using Socket's built-in on() method and passing in two arguments, an eventName and a callback.
    - eventName is a string and it represents the name of the event that we want to listen for.
        - There are common built-in events such as: 'connect', 'connection', 'disconnect'.
        - We may also define custom event names like: 'chat message'
    - callback is a function that will be executed when the specified event is emitted
        - When the callback is invoked, it receives arguments based on what was passed from the other side using `socket.emit()`
            - Any additional arguments passed to `socket.emit()` are passed directly to `socket.on()`
                - (e.g., input.value from our client-side js)

* Note that socket.emit() was used in our client-side js & socket.on() was used in our server-side js
    - Emit() is our sender & on() is our receiver

/*************************************************************************
* Broadcasting
*************************************************************************/
/*
Socket.io can emit events from the server, to the rest of the users.

I tried the code snippets below, but do not understand where to use & how to use it.
I tried it on both the server & client, but did not 

io.emit('hello', 'world');  // should emit event to all connected sockets
 - 

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');  // should emit event to all except a certain emitting socket?
});

/*************************************************************************
 * Let's review
*************************************************************************/

/*
I was supposed to read & do an overview.
Instead let's find out how to create an event that's not in the doucmentation (at least where I last left off)

This is my attempt to rubber duck: read if you want to

The moment you, I, or anyone connects to the "chat room" (https://tryingwebsockets-production.up.railway.app/) 
    - I see "A user connected" within my terminal
        - I see similar when anyone leaves/closes the browser (A user disconnected)
I would like to emit this event so it renders to everyone within the "chat room" vs just me seeing it in the terminal

In my server.js file: (Bare with my guessing in the //comments )

// When a user connects to the 'connection' channel
io.on('connection', (socket) => {

    // A message displays on the terminal
    console.log('A User connected');

    // On the backend, I have a socket that is on the `chat message` channel that takes in a single argument, which is a string
    socket.on('chat message', (message) => {

        // The string passed in is received from the input element on our frontend (frontend code below, dont skip ahead)
        console.log('message: ' + message);

        // I have an io that receives input.value and emits the message back? to the frontend to render the message to the chat room
        io.emit('chat message', message);
    })

    // I have a socket that is on the 'disconnect' channel
    socket.on('disconnect', () => {

        // A message displays on the terminal
        console.log('A User disconnected');
    })
})

In my main.js file: Our client-side javascript

// We have an eventlistener on our form element that listens for submits
form.addEventListener('submit', function(event) {

    // When the form is submitted we prevent the page from refreshing
    event.preventDefault();

    // We determine if the input element within our form contains any text within itself
    if (input.value) {

        // If the user types a message and presses enter we send the input's value to the 'chat message' channel
        socket.emit('chat message', input.value);

        // Since we prevent the page from refreshing, we want to reset the input by inserting an empty string into it
        input.value = '';
    }
})

// On the frontend, I have a socket that is on that 'chat message' channel, and receives a string as an argument
socket.on('chat message', function(message) {

    // We create a variable which creates a listing item element using DOM api
    var item = document.createElement('li');

    // We insert our string argument into the created li element,
    item.textContent = message;

    // We have an unordered list element with an id of messages. We append every created li element into the ul
    messages.appendChild(item);

    // sum fancy from socket.io documentation 
    window.scrollTo(0, document.body.scrollHeight);
})

After rubber ducking and pseudocoding these snippets from socket.io's documentation,
I now think that this current implementation works like this:
Server -> Client -> Server -> Client

For example:
User connects (Server)
User submits input (Client)
Server receives input (Server)
Chat messages created (Client)


*/