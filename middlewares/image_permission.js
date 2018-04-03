var Imagen = require("../models/imagenes");

module.exports = (image, req, res)=>{
	// si la funcion regresa true se tienen permisos para ver, editar o eliminar una imagen
	if(req.method === "GET" && req.path.indexOf("edit") < 0){
		return true;
	}

	//en caso de que se hayan creado imagenes sin un creator
	if(typeof image.creator == "undefined"){
		return false;
	}

	//si el creador de la imagen es igual a el usuario logeado la muestra
	if(image.creator._id.toString() == res.locals.user._id){
		return true;
	}

	return false;
}