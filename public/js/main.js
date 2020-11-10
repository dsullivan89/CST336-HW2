$(document).ready(function() {

	var socket = io();


	var hasUserName = false;
	var username = "";
	var connected = false;
	
	$("#app-conversation-input-submit").click( function() {

		var message = $("#app-conversation-input").val(); // get message
		$("#app-conversation-input").val(""); // clear input field

		console.log(message); // make sure it works

		if(!hasUserName)
		{
			username = message;
			socket.emit('add user', username);
			console.log("Logging in with username: " + username);
			hasUserName = true;

			// update input placeholder text
			$("#app-conversation-input").attr("placeholder", "Type your message here.");
		}
		else
		{
			socket.emit('new message', message);
			$("#app-conversation-messages-list").append(
				`<li class="app-message-sent">${message}</li>`);
		}
		
	});

	socket.on('login', (data) => {
		connected = true;
		// Display the welcome message
		var message = "Welcome to City Chat!";
		$("#app-header").text(message);
		$("#app-sidebar-users-list-heading").text(`Users: ${data.numUsers}`);

		$('#app-sidebar-users-list').empty()
		for(i = 0; i < data.clientList.length; i++)
		{
			$("#app-sidebar-users-list").append(
				`<li class="app-users-list-item">${data.clientList[i]}</li>`)
		}

		console.log(message, {
		  prepend: true
		});
		
	 });
  
	 // Whenever the server emits 'new message', update the chat body
	 socket.on('new message', (data) => {

		$("#app-conversation-messages-list").append(
			`<li class="app-message-received">${data.username}: ${data.message}</li>`);
	 });
  
	 // Whenever the server emits 'user joined', log it in the chat body
	 socket.on('user joined', (data) => {
		console.log(data.username + ' joined');
		
		$("#app-sidebar-users-list-heading").text(`Users: ${data.numUsers}`);

		$("#app-sidebar-users-list").append(
			`<li class="app-users-list-item">${data.username}</li>`
		)
	 });
  
	 // Whenever the server emits 'user left', log it in the chat body
	 socket.on('user left', (data) => {
		console.log(data.username + ' left');

		$("#app-sidebar-users-list-heading").text(`Users: ${data.numUsers}`);

		$('#app-sidebar-users-list').empty()
		for(i = 0; i < data.clientList.length; i++)
		{
			$("#app-sidebar-users-list").append(
				`<li class="app-users-list-item">${data.clientList[i]}</li>`)
		}
	 });

	socket.on('disconnect', () => {
		console.log('you have been disconnected');
	 });
  
	 socket.on('reconnect', () => {
		console.log('you have been reconnected');
		if (username) {
		  socket.emit('add user', username);
		}
	 });
  
	 socket.on('reconnect_error', () => {
		console.log('attempt to reconnect has failed');
	 });
  
	 socket.on('userList', userArray => {
		// refresh  the display to show the userArray
		//userArray.forEach(element => {
		//	$("#app-sidebar-users-list").append(
		//		`<li class="app-users-list-item">${element}</li>`)
		});
	
 });
 
 // <div id="messages"