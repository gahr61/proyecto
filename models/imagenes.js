var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var img_schema = new Schema({
	title: {type: String, require: true},
	//agregamos un campo el cual relaciona las imagenes con usuarios
	// Schema.Type.ObjectId se puede considerar una llave foranea
	// nombrecampo: {type: Schemma.Types.ObjectId, ref: "modelos que necesitamos" }
	creator: {type: Schema.Types.ObjectId, ref: "User"},
	extension: {type: String, require: true} //esto se hace por que se guarda la imagen con el id de la imagen y solo necesitamos la extension
});

//creamos el modelo
var Imagen = mongoose.model("Imagen", img_schema);

//exportamos el modelo
module.exports = Imagen;