//importamos la libreria mongoose para la conexion a mongoDB
var mongoose = require("mongoose");
var Schema = mongoose.Schema;



//conexion con mongodb mongoose.connect("motordb://servidor/nombre de db")
mongoose.connect("mongodb://localhost/fotos");


/*se crea una tabla en la base de datos
en base de datos no relacionales se crean objetos y se guardan
nombreTablaSchemaJSON={
	campo:tipo
}
var userSchemaJSON = {
	email:String,
	password:String
}

//var user_schema = new Schema(userSchemaJSON); //creamos el nuevo objeto pasandole el json anterior
*/


/*
	Tipo de datos permitidos en mongodb
	String
	Number
	boolean
	date
	buffer
	mixed
	objectid
	array
*/

//validacion personalizada
/*
	se envia un 
	validate : { 
		validator:function(variable a validar){ develve verdadero o falso
			return this.variable virtual = variable
			}, 
			mensagge: mensaje
		}
*/
var password_validation = {
	validator:function(p){
		return this.password_confirmation == p;
	},
	message: "Las contraseñas no son iguales"
}


//enum se debe de crear un arreglo de valores para que se pueda verificar el valor
var posibles_valores = ["M", "F"];

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email valido"];

var user_schema = new Schema({ //creamos el nuevo objeto pasandole el json anterior
	name:String,
	username: {type: String, required:true, maxlenght:[50, "Username muy grande"]},
	password: {type: String, minlength: [8, "El password es muy corto", ], validate: password_validation},
	age: {type: Number, min:[4, "La edad no puede ser menor que 5"], max:[100, "La edad no puede ser mayor a 100"]}, //validacion {tipo, min:[numero, "mensaje"], max: [numero, "mensaje"]}
	email: {type: String, required:"El correo es obligatorio", match: email_match}, //validacion {tipo, requerido:false | true | "mensaje"} 
	date_of_birth: Date,
	sex : {type:String, enum: {values: posibles_valores, message: "Opcion no valida"}}
});


//creamos una variable virtual la cual validara el password
user_schema.virtual("password_confirmation").get(()=>{
	return this.p_c;
}).set((password)=>{
	this.p_c = password;
});

//creamos un modelo el cual establece la conexion con la base de datos
var User = mongoose.model("User", user_schema); //mongoose.model("nombre modelo", schema)

module.exports.User = User;