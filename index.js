﻿var express = require('express');
var app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);
	
var port =  process.env.PORT || 5000;


app.configure(function(){
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
	
	//Set special header for iframe
	app.get('/app/', function(req, res, next){
		res.setHeader('X-Frame-Options', 'GOFORIT');
		
		next();
	});
});

server.listen(app.get('port'), function() {
	console.log("server running and listening on port "+port);
});







//	TEST SETUP

var Song = require('./server/Song.js');

var testParty = {
	playlist: [
		new Song('Testygaga - one big fat test', 'url', '/song.wma')
	]
};

app.get('/api/:hash/:action', function(req, res){
	
	if(req.params.action == 'getPlaylist'){
		res.send(JSON.stringify(testParty.playlist));
	} else {
		res.end();
	}
});


io.sockets.on('connection', function (socket) {
	socket.on('party_getState', function (data) {
		socket.emit('party_state', testParty.playlist);
		console.log(data);
	});
  
});