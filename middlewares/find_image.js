//creamos este middleware para buscar la imagen ya que se repite en varios puntos del archivo
//importamos el modelo
var Imagen = require("../models/imagenes");
var owner_check = require("./image_permission");

module.exports = (req, res, next)=>{
	Imagen.findById(req.params.id)
		//para acceder al objeto creator con populate que hace la funcion de join
		.populate("creator")
		//hacemos la ejecucion de la funcion 
		.exec(function(err, imagen){
			//llamamos la funcion de permosos de imagenes enviando los parametros requeridos
			
			if(imagen != null && owner_check(imagen, req, res)){
				//se guarda en una variable locals
				res.locals.imagen = imagen;
				//ejecutamos la siguiente funcion
				next();
			}else{
				res.redirect("/app");
			}
		});
}
