var socket = io(); //conecta con el servidor de web socket

//cuando llegue un nuevo mensaje
socket.on("new image", (data)=>{
	//data es la informacion de la imagen
	data = JSON.parse(data);

	var container = document.querySelector("#imagenes");

	//obtiene un selector css
	var source = document.querySelector("#image-template").innerHTML;

	var template = Handlebars.compile(source);

	//agregamos el template al container 
	container.innerHTML += template(data);

});