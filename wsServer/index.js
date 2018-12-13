const WebSocket = require('ws');
const wss = new WebSocket.Server({port:6666});
var sockets = [];
var name_usuario = false;

var info = {};
var infos = [];
var json;
var chats = [];
var ids_receiver = [];


console.log("Escuchando en 6666")
wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client){
		if(client.readyState === WebSocket.OPEN){
			client.send(data);
		}
	});
};
function mostrar_users(data){
	var keys = Object.keys(sockets);
	var values = Object.values(sockets);
	/*for(var i in infos){
		if(infos[i].id_user === id)
			name_usuario = infos[i].username;
	}
	for (var i = 0; i < infos.length; i++) {
		if(keys[i] !== id){
			json = JSON.stringify({type:'users',username:name_usuario});
			values[i].send(json);
			//console.log(json,i);
		}			
	}	*/
	
	
	wss.clients.forEach(function each(client){
		for(var i in keys)
			if(client.readyState === WebSocket.OPEN && client === values[i])
				client.send(data);
								
								
	});
						
}
const crear_conexion = function(id,name){
	for (var i = 0; i < infos.length; i++) {
		if(infos[i].username === name){
		    chats[id]=infos[i].id_user;	
		    //ids_receiver.push(infos[i].id_user);
		    return true;
		}
	}	
	return false;
};
const search = function(id){
	var keys = Object.keys(chats);
	var valueSockets = Object.values(sockets);
	//console.log(keys.length);	
	var values = Object.values(chats);
	for(var i = 0;i<keys.length;i++){
		if(chats[id] === values[i])
			//console.log(sockets[i].id_ws,ids_receiver[i]);
			return  valueSockets[i];
	}
	return -1;
}
const check_conexion = function(id){	
	var keys = Object.keys(sockets);		
	for(var i=0;i<keys.length;i++){
		//if(sockets[i].id_ws === id)
		if (keys[i] === id) 
			return true;
	}
	return false;
};
wss.on('connection',function connection(ws,req){		

	//var id = req.connection.remoteAddress;
	var id = req.headers['sec-websocket-key'];	
	console.log("Nueva Conexion::",id);			
	//ws.send(id);
	//var conx = check_conexion(sockets,id);		
	
	ws.on('message',function incoming(data){		
	var conx = check_conexion(id);
	 	console.log(data,conx,id);
				if(!conx){	    		
					name_usuario = data;  
					info.username = name_usuario;
					info.id_user = id;

					//json = JSON.stringify({type:'users',username:name_usuario});
					//wss.broadcast(json);
					infos.push({type:'users',username:name_usuario,id_user:id});
					//infos.push({type:'id_users',data:info.id_user});
					json = JSON.stringify(infos);
					console.log(json);
					ws.send(json);	
										
					if(Object.keys(sockets).length>0) mostrar_users(json);
									
					
		    	}else{	
		    		var type = JSON.parse(data);
		    		
		    		if(type.type === 'status'){
		    			name_usuario = type.username;		    	
		    			console.log(name_usuario);			
		    			var check = crear_conexion(id,name_usuario);		    			
		    			console.log('Chats: ',chats);
		    			console.log('Destinatarios: ',Object.values(chats).length);
		    			if(check){
		    				json = JSON.stringify({type:'status',status:check});		    						    		
		    			}else{
		    				json = JSON.stringify({type:'status',status:check});		    				
		    			}
		    			ws.send(json);		

		    		}else if(type.type === 'message'){
		    			for(var i in infos){
				    		if(infos[i].id_user === id)
				    			name_usuario = infos[i].username;
				    	}				    			
				    	//infos.push({type:'message',mensaje:mensaje,id_user:id,username:name_usuario});		    					    			
				    	json = JSON.stringify({type:'message',username:name_usuario,mensaje:type.mensaje});		    			
				    	ws.send(json);				    			
				    	//console.log(search(),ids_receiver.length);				    	
				    	var id_r = search(id);				    			
				    	id_r.send(json);
				    	//sockets[id_r].socket.send(json);
				    	//console.log(id_r);

		    		}
		    		
		    		
		    		/*if(check){
		    				json = JSON.stringify({type:'status',status:check});
		    				ws.send(json);				    		
		    		}else{
		    			json = JSON.stringify({type:'status',status:check});
		    			ws.send(json);
		    			var mensaje = data;
		    			console.log(mensaje);
		    			if(mensaje.type === 'mensaje'){		    				
				    			
				    			for(var i in infos){
				    				if(infos[i].id_user === id)
				    					name_usuario = infos[i].username;
				    			}				    			
				    			//infos.push({type:'message',mensaje:mensaje,id_user:id,username:name_usuario});		    					    			
				    			json = JSON.stringify({type:'message',username:name_usuario,mensaje:mensaje.mensaje});		    			
				    			ws.send(json);				    			
				    			//console.log(search(),ids_receiver.length);
				    			var id_r = search(id);				    			
				    			//id_r.send(json);
				    			sockets[id_r].socket.send(json);
				    			//console.log(id_r);

				    			
				    	}
		    		}*/
		    		
		    	
		    		
		    		/*info = {
		    			to:id,		    			
		    			mensaje:data.utf8Data,
		    		};
		    		console.log(info);		    		
					var json = JSON.stringify({type:'message',data:info});			
					wss.clients.forEach(function each(client){
						if(client !== ws && client.readyState === WebSocket.OPEN){
							//var id = req.headers['sec-websocket-key'];
							//var mess = JSON.parse(data);				
							//sockets[mess.to].send(mess.message);				
		    				console.log('Mensaje de :: ', id);
		    				console.log('Mensaje :: ', data);
		    				//client.send(sockets[mess.to]);
							client.send(json);
							
						}
					});*/
		    	}	    	
		    	
		   																																					
			sockets[id]=ws;
			
		   //sockets.push({id_ws:id,socket:ws});		

		    	
		
	});


	ws.on('close',function(connection){		
			var id = req.headers['sec-websocket-key'];
			console.log('Cerrando Conexion::',id);
			
			sockets.splice(id,1);
		
		
	});
	
	
	
});

