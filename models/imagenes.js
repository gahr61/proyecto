var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var img_schema = new Schema({
	title: {type: String, require: true}
});

//creamos el modelo
var Imagen = mongoose.model("Imagen", img_schema);

//exportamos el modelo
module.exports = Imagen;