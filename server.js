var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var clients = {};

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile('index.html', { root: __dirname });
});


io.on('connection', function(socket) {
	console.log('user connected');
	clients[socket.id] = socket;
	io.emit('new-player', {id: socket.id, name: 'Guest'});
	socket.on('key', function(msg) {
		console.log(socket.id + ' pressed ' + msg['dir']);
		io.emit('player-move', {id: socket.id, key: msg['dir']});
	});
});

server.listen(8082);
console.log("Server listening!");