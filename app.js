var express = require("express");
var bodyParser = require("body-parser");
//importar modelo de usuario require("./carpeta/nombreModelo").atributo
var User = require("./models/user").User; 
//importar modelo de imagen
var Imagen = require("./models/imagenes").Imagen;

//importa libreria de sesiones
//guarda la session en memoria para mejorar esto utilizaremos cookies ya no se utiliza
//express session
//var session = require("express-session"); 
//importamos libreria de cookie sesion
var cookieSession = require("cookie-session");

//importar archivo de rutas
var route_app = require("./router_app");

//importar middleware
var session_middleware = require("./middlewares/session");

//importamos el method-override
var methodOverride = require("method-override");


var app = express();

//bajo que nombre vamos a identificar que metodo se va a utilizar
app.use(methodOverride("_method"))

//para montar un middleware de archivos estaticos
//express.static("carpeta de archivos")
//se puede agregar un prefijo a las carpetas para evitar que exista una ruta y existan conflictos
//app.use("/prefijo", express.static("carpeta de archivos estaticos"))
app.use("/public", express.static("public"));

//importamos el middleware
//para peticiones application/json
app.use(bodyParser.json());
//la variable extended define que algoritmo utilizar para parsear un archivo
//si esta en falso no se pueden parsear arreglos u objetos
//si es true se puede parsear cualquier elemento
app.use(bodyParser.urlencoded({extended:true}));

/*para manejar sesiones debemos de crear un middleware con la importacion que realizamos
pasando parametros, que nos permite almacenar sesiones
	session({
		secret: "" //permite generar identificadores de sesion, debe ser unico y es requerido
		genid: function(req){ //Se puede generar una funcion que genere un id unico para cada inicio de sesion
			
		},
		resave: true | false, //quiere decir que si se realiza un cambio en la aplicacion se va a 
								guardar nuevamente la session ej. dos usuario iniciando sesion al mismo 
								tiempo con una misma cuenta, en este caso seria true para que no exista conflictos
		saveUninitialized: true | false // quiere decir que si queremos guardar la sesion aun sin estar inicializada

	})
*/
//si utilizamos express-session se utiliza esta parte
/*
app.use(session({
	secret: "123abc456def",
	//si no se agregan las siguientes funciones obtendremos unos mensajes de warning
	resave: false,
	saveUninitialized: false
}));*/

/*como se va a utilizar cookie-session se hace de la siguiente manera
	cookieSession({
		name: "nombre de la cookie",
		keys: ["nombre llave", "nombre llave"]
	})

	no se necesita realizar otra modificacion para obtener las sessiones
	esto se hace para que al reiniciar el servidor no se elimine la session y se quede
	en la cookie
*/
app.use(cookieSession({
	name: "session",
	keys: ["llave-1", "llave-2"]
}));

app.set("view engine", "pug");

app.get("/", (req, res)=>{
	res.render("index");
	console.log(req.session.user_id);
});

app.get("/signup", (req, res)=>{
	//relizarmos una consulta
	//find obtiene todos los registros ya que no se le pasan parametros de busqueda
	//err si no se presenta un error
	//doc los datos de la base de datos
	User.find((err, doc)=>{
		console.log(doc);
		res.render("signup");	
	});
	
});


app.get("/login", (req, res)=>{
	res.render("login");
})
app.post("/sessions", (req, res)=>{
	/*para buscar un documento o fila en mongodb se utiliza el modelo y el metodo find y findOne
		find devuelve un documento que cumple con la condicion
		find(
			{arreglo de elemento devueltos}, 
			"campos que queremos mostrar(puede ser omitico) separados por espacio", 
			function(err, docs){}
		)

		findOne devuleve unicamente un elemento

		findById("_id", function(err, doc){})
	*/
	User.findOne({email:req.body.email, password:req.body.password}, function(err, user){
		//para ver la sesion esta disponible en req.session
		req.session.user_id = user._id;
		//una vez que se inicia session hay que redirigir a la ruta deseada en este caso es a app/
		res.redirect("/app");
	})
})

app.post("/users", (req, res)=>{
	//req.body contiene los parametros que se enviaron desde el formulario
	//crear un nuevo usuario
	var user = new User({email: req.body.email, 
						password:req.body.password, 
						password_confirmation: req.body.password_confirmation,
						username: req.body.username
					});
	//guardar datos
	/*
	user.save(function(err){ //recibimos un callback la cual se ejecuta despues de guardar los datos
		if(err){
			console.log(String(err));
		}
		res.send("recibimos datos");
	});*/


	//utilizamos promises en lugar de callbacks, user.save().then(function(){},function(err){})
	user.save().then(function(us){
		res.send("Guardamos el usuario exitosamente");
	}, function(err){
		if(err){
			console.log(String(err));
			res.send("No pudimos guardar la información");
		}
	});
	
});


//sesiones
app.use("/app", session_middleware);
//montar archivo de rutas en este caso se igresa app.get("/prefijo", archivorutas)
//esto da como resultado localhost/prefijo/rutas
app.use("/app", route_app);


app.listen(8080);