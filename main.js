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

Hosting the app that's not the root of the website (e.g., https://astroauction.com/chatapp) then we need to specify the path in both the server & the client

If you've reached this point, start the server & open several tabs to this app (localhost:3000)
The terminal should display console logs (A User connected) each time a new client connects (the opening of several tabs to the URL localhost:3000)


*/