/*para utilizar socket io vamos a generar el archivo realtime.js
exportando una funcion con parametros 
server - nuevo servidor socket.io
sessionMiddleware - para obtener los valores de la sesion
*/
module.exports = (server, sessionMiddleware)=>{
	var io = require("socket.io")(server);
	var redis = require("redis");
	var client = redis.createClient();

	//suscribe a un canal
	client.subscribe("images");

	io.use((socket, next)=>{
		//configuracion de socket para que utilice la misma sesion de express
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	//cada que un cliente reciba un mensaje se va a ejecutar una funcion que recibe
	//client.on("message", (canal donde se publico la informacion, mensaje que se publico))
	client.on("message", (channel, message)=>{
		console.log("Recibimos un mensaje del canal "+channel)
		console.log(message);
		if(channel == "images"){
			io.emit("new image", message);  //envia un mensaje a todos los sockets

		}
	});

	//evento para cuando exista una nueva conexion
	io.sockets.on("connection", function(socket){
		console.log(socket.request.session.user_id);
	});
}