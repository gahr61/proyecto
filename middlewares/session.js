//para buscar y mostrar la informacion de un usuario debemos importar el modelo
var User = require("../models/user").User;

module.exports = (req, res, next)=>{

	if(!req.session.user_id){
		res.redirect("/login");
	}else{
		//buscamos la informacion de la sesion del usuario en este caso el id
		//dentro del modelo con la funcion 
		//findById(variableSesion, function(err, nombreVariable){})
		User.findById(req.session.user_id, function(err, user){
			if(err){
				res.redirect("/login");
			}else{
				/*
				la variable locals almacena la informacion de las variables que 
				deseamos enviar a las vistas
					res.locals = {variableEnvio: nombreVariable}
				*/
				res.locals = {user: user}
				next();		
			}
		});
		
	}
}