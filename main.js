alert('hello world')

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


*/