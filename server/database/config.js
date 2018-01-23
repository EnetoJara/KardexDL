/**
* Estas son las propiedades que se necesitan para la coneccion con la BD
* @private
* @property config
*/
var config = {
  host: 'localhost', // aqui va URL del servidor donde va a esta la BD
  port: '3306', // puerto por el cual se va conectar el server de la pagina con el server de la BD
  user: 'kardexdl', // usuario de la BD NOTA: quitar root y poner otro usuario con menos privilegios
  password: '72614', // contraseña de la BD
  database: 'UNEDL', // nombre de la BD
  dateStrings: true // darle formato Humando a las fehcas
};
/**
De esta forma es como se hace publico un metodo en NODEJS
equivale al public en otros lenguajes
*/
module.exports = config;
