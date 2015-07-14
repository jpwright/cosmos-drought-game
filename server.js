var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var players = {};
var green_plants = [];

var NUM_COLORS = 3;

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile('index.html', { root: __dirname });
});


io.on('connection', function(socket) {
	console.log('user connected (id '+socket.id+')');
	var color = (Math.round(Math.random()*(NUM_COLORS-1))+1);
	socket.emit('your-info', {id: socket.id, color: color});
	
	for (var id in players) {
		socket.emit('existing-player', {id: id, name: players[id].name, color: players[id].color, position: players[id].position});
	}
	
	for (var i = 0; i < green_plants.length; i++) {
		socket.emit('green-plant', {position: green_plants[i]});
	}
	     
	players[socket.id] = {socket: socket, name: 'Guest', color: color, position: {x: 135, y: 135}};
	
	io.emit('new-player', {id: socket.id, name: 'Guest', color: color, position: {x: 135, y: 135}});
	socket.on('key', function(msg) {
		//console.log(socket.id + ' pressed ' + msg['dir']);
		players[socket.id].position = msg.position;
		io.emit('player-move', {id: socket.id, dir: msg['dir'], delta: msg['delta']});
	});
	
	socket.on('green-plant', function(msg) {
		io.emit('green-plant', {position: msg.position});
		green_plants.push(msg.position);
	});
	
	socket.on('username', function(msg) {
		players[socket.id].name = msg.name;
		io.emit('username', {id: socket.id, name: msg.name});
	});
	
	socket.on('disconnect', function() {
		console.log('user disconnected (id '+socket.id+')');
		io.emit('player-left', {id: socket.id});
		delete players[socket.id];
	});
});

function brownPlants() {
	//console.log("entered brown plants");
	var plant = green_plants.shift();

	if (plant) {
		io.emit('brown-plant', {position: plant});
	}
	setTimeout(brownPlants, (Math.random()*4000)+1000);	
}

brownPlants();
server.listen((process.env.PORT || 8082));
console.log("Server listening!");