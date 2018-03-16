var express = require("express");

//importar modelo de imagen
//NOTA: no se xq en esta importacion no se puso require().modelo??
var Imagen = require("./models/imagenes");

//importar packete de rutas
var router = express.Router();


//implementamos el middlewware
var image_finder_middleware = require("./middlewares/find_image");


router.get("/", (req, res)=>{
	//se busca al usuario una vez que se logea
	res.render("app/home");
});

/*
	REST
	con rest las acciones no dependen de la url si no de las acciones http(get,post,put,delete)
	que las esta accesando

*/

//para poder accesar a los metodos rest de las imagenes necesitamos dos rutas
//mostrar formulario de carga de imagenes
router.get("/imagenes/new", (req, res)=>{
	res.render("app/imagenes/new")
});

//para utilizar el middleware en todas las rutas que esten iguales utilizamos
//	router.all("ruta*", middleware) se utiliza * para decir que despues de la ruta puede ir cualquier cosa

router.all("/imagenes/:id*", image_finder_middleware)

//editar imagen
router.get("/imagenes/:id/edit", (req, res)=>{
	//cuando se agrega router.all se utiliza unicamente lo necesario y no necesitamos enviar
	//la variable imagen a las vistas ya que esta almacenada en locals
	res.render("app/imagenes/edit");


});

//creacion de rutas para el manejo de imagenes
//utilizamos el metodo route("url/:variable").(get,post,put,delete)
router.route("/imagenes/:id") //esto quiere decir que vamos a enviar un id a la url/imagenes
	.get((req,res)=>{		//ej. /imagenes/1234asd
		res.render("app/imagenes/show");
	})						
	.put((req,res)=>{ //actualiza registros
		res.locals.imagen.title = req.body.title;
		res.locals.imagen.save(function(err){
			if(err){
				res.render(err);
			}else{
				res.redirect("/app/imagenes");
			}
		})

	})
	.delete((req,res)=>{
		//para eliminar un elemento de la base de datos utilizamos el metodo findOneAndRemove({id}, function)
		Imagen.findOneAndRemove({_id: req.params.id}, function(err){
			if(err){
				res.redirect("/app/imagenes");
			}else{
				res.redirect("/app/imagenes");
			}
		})
	});

//coleccion de imagenes
router.route("/imagenes")
	.get((req,res)=>{
		//para obtener todas las imagenes se utiliza el comando find sin campos
		//find({})
		Imagen.find({}, function(err, imagenes){
			//si existe un error redirigir a el inicio /app
			if(err){ 
				res.redirect("/app");
				return; //para evitar que continue
			}

			//si no existen errores se muestra la ventana de imagenes
			res.render("app/imagenes/index", {imagenes:imagenes});
		})
	})						
	.post((req,res)=>{
		//guardamos la imagen en la base de datos
		var data = { //extraemos la informacion del formulario
			title : req.body.title
		}
		//creamos una instancia del modelo imagen
		var imagen = new Imagen(data);
		
		imagen.save(function(err){
			if(!err){
				res.redirect("/app/imagenes/"+imagen._id);
			}else{
				res.render(err);
			}

		})
	});

//exportar las rutas al controlador app.js
module.exports = router;