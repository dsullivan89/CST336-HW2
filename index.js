// this is the server, main.js is part of the client.

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// add project folders so we can provide images, javascript, and css.
// Maybe our client's index.html page can get it's own folder too but 
// im just going to get this working and not worry about it.
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'img')));
//app.use(express.static(path.join(__dirname, 'js')));

// our sockets code (how exciting)

// this code comes from the socket.io chat demo 
//  >>> https://github.com/socketio/socket.io/tree/master/examples/chat <<<
let numUsers = 0;

io.on('connection', (socket) => {
	let addedUser = false;
 
	// when the client emits 'new message', this listens and executes
	socket.on('new message', (data) => {
	  // we tell the client to execute 'new message'
	  socket.broadcast.emit('new message', {
		 username: socket.username,
		 message: data
	  });
	});
 
	// when the client emits 'add user', this listens and executes
	socket.on('add user', (username) => {
	  if (addedUser) return;
 
	  // we store the username in the socket session for this client
	  socket.username = username;
	  ++numUsers;
	  addedUser = true;
	  socket.emit('login', {
		 numUsers: numUsers
	  });
	  // echo globally (all clients) that a person has connected
	  io.sockets.emit('user joined', { // broadcast was removed.
		 username: socket.username,
		 numUsers: numUsers
	  });
	});
 
	// when the client emits 'typing', we broadcast it to others
	socket.on('typing', () => {
	  socket.broadcast.emit('typing', {
		 username: socket.username
	  });
	});
 
	// when the client emits 'stop typing', we broadcast it to others
	socket.on('stop typing', () => {
	  socket.broadcast.emit('stop typing', {
		 username: socket.username
	  });
	});
 
	// when the user disconnects.. perform this
	socket.on('disconnect', () => {
	  if (addedUser) {
		 --numUsers;
 
		 // echo globally that this client has left
		 socket.broadcast.emit('user left', {
			username: socket.username,
			numUsers: numUsers
		 });
	  }
	});
});