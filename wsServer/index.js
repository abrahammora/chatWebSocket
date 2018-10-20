const WebSocket = require('ws');
const wss = new WebSocket.Server({port:6666});
var sockets = [];

console.log("Escuchando en 6666")
wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client){
		if(client.readyState === WebSocket.OPEN){
			client.send(data);
		}
	});
};

wss.on('connection',function connection(ws,req){		
	/*var id = ws.upgradeReq.headers['sec-websocket-key'];
	console.log('New Connection id :: ', id);
	ws.send(id);*/
	//var id = req.connection.remoteAddress;
	var id = req.headers['sec-websocket-key'];
	console.log("Nueva Conexion::",id);
	ws.send(id);
	ws.on('message',function incoming(data){				
		wss.clients.forEach(function each(client){
			if(client !== ws && client.readyState === WebSocket.OPEN){
				var id = req.headers['sec-websocket-key'];
				var mess = JSON.parse(data);
				//sockets[mess.to].send(mess.mess);
    			console.log('Message on :: ', id);
    			console.log('On message :: ', mess);
				client.send(data);
			}
		});
	});
	sockets[id] = ws;
	
});