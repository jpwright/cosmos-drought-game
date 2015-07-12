var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var players = {};

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile('index.html', { root: __dirname });
});


io.on('connection', function(socket) {
	console.log('user connected');
	socket.emit('your-id', {id: socket.id});
	
	for (var id in players) {
		socket.emit('existing-player', {id: id, name: players[id].name, position: players[id].position});
	}
	     
	players[socket.id] = {socket: socket, name: 'Guest', position: {x: 135, y: 135}};
	
	io.emit('new-player', {id: socket.id, name: 'Guest', position: {x: 135, y: 135}});
	socket.on('key', function(msg) {
		console.log(socket.id + ' pressed ' + msg['dir']);
		players[socket.id].position = msg.position;
		io.emit('player-move', {id: socket.id, dir: msg['dir'], delta: msg['delta']});
	});
});

server.listen(8082);
console.log("Server listening!");