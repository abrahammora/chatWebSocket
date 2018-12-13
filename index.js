var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

const readline = require('readline');



  
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
   prompt: 'Escribe> '
});

var msj;



client.on('connectFailed',function(error){
	console.log('Error de conexion: ' + error.toString());
});

client.on('connect', function(connection) {
    
    console.log('Cliente Conectado');
    connection.on('error', function(error) {
        console.log("Error de Conexion: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {    	
      try{
        var json = JSON.parse(message.utf8Data);
      }catch(e){
        console.log('Invalido JSON: ',message.utf8Data);
      }
      //console.log(json);
      /*if (message.type === 'utf8') {                  
            //console.log("Recibido: '" + message.utf8Data + "'");                          
           console.log("Recibido: '" + data.username + " "+ data.to + "'");                          
      } */

     for(var i in json) {
      if(json[i].type === 'users'){
          console.log("Usuarios Conectados: '"+ json[i].username + "'");               
          if(json.length === 1) console.log("Esperando mas usuarios....");              
        }
     }
     /*if(json.type === 'users'){        
          //console.log((Object.keys(json.data).length));
           console.log("Usuarios Conectados: '" + json.username + "'" );  
           //if((Object.keys(json.data).length === 2)) console.log("Esperando usuarios...");
        //   chooseUser();                        
      }*/

     if(json.length>1){chooseUser('status');}  


     if(json.type === 'status'){
        if (json.status) {
          sendMessage('message');
        }else{
          console.log('No existe');
          chooseUser('status');
        }
     }else if(json.type === 'message'){
           console.log("" + json.username + "@:"+ json.mensaje + "");   
           sendMessage(json.type);           
      }
        

    //console.log((Object.keys(json.type).length));
    
   /* if(json.type === 'users'){        
          //console.log((Object.keys(json.data).length));
           console.log("Usuarios Conectados: '" + json.data.username + "'" );  
           //if((Object.keys(json.data).length === 2)) console.log("Esperando usuarios...");
        //   chooseUser();                        
      }
      */ 
       
    });
   
   function sendMessage(type){
    if(connection.connected){           
          rl.question('', (linea) => {        
            msj = JSON.stringify({type:type,mensaje:linea});
            connection.sendUTF(msj);
            //rl.close();
            rl.prompt();
            //rl.pause();
            
          });   
       /*rl.on('line',(linea) =>{
          msj = JSON.stringify({type:type,mensaje:linea});
          connection.sendUTF(msj);
        });*/
          
    }
   }

    function nameUser(){
      if(connection.connected){
          rl.question('Ingresa un nombre de usuario:', (name) => {        
          connection.sendUTF(name);
          //rl.close();
          rl.pause();
        });   
      }
      
    }
   function chooseUser(type){
      if(connection.connected){
          rl.question('¿Con quien quieres chatear?', (name) => { 
          msj = JSON.stringify({type:type,username:name});
          connection.sendUTF(msj);
          //rl.close();
          rl.pause();
        });   
      }
   }
   
  
  
       /*rl.on('line', (input) => {            
          connection.sendUTF(input);                       
      });*/
     
     
   
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            //setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
    nameUser();
   
});
 
client.connect('ws://localhost:6666/', 'echo-protocol');