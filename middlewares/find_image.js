//creamos este middleware para buscar la imagen ya que se repite en varios puntos del archivo
//importamos el modelo
var Imagen = require("../models/imagenes");

module.exports = (req, res, next)=>{
	Imagen.findById(req.params.id, function(err, imagen){
		if(imagen != null){
			console.log("encontre imagen")
			//se guarda en una variable locals
			res.locals.imagen = imagen;
			//ejecutamos la siguiente funcion
			next();
		}else{
			res.redirect("/app");
		}
	});
}
