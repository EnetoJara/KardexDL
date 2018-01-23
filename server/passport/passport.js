/**
	Está clase se encarga de autenticar a los usuarios
	NOTA: FAVOR DE NO MOVER NADA DE AQUI
*/
/*var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {

        var config = require('.././database/config'); // se inporta las configuraciones de la BD
        var db = mysql.createConnection(config); // se abre la coneccion
        db.connect();
        // se busca el usuario en la tabla usuarios
        db.query('CALL GET_USUARIO(?);', username, function (err, rows, fields) {
            if (err) {
                throw err; // truena si hay error
            }
            db.end(); // cierra la coneccion
            if (rows[0].length > 0) { //si el nombre es correcto, se checa si la contraseña es correct
                var user = rows[0];
                var ress = bcrypt.compareSync(password, user[0].PSSWRD); // Si password de la BD es igual a la que ingreso el usuario, se inicia secion
                if (ress) {
                    return done(null, {
                        id: user[0].ID,
                        idRole: user[0].ROLE_ID,
                        nombre: user[0].NOMBRE,
                        role:    user[0].ROLE,
                        usuario: user[0].USUARIO,
                        carrera: user[0].CARRERA,
                        idCarrera: user[0].CARRERA_ID
                    });
                } else {
                    //la contraseña no es correcta
                    return done(null, false, req.flash('authmessage', 'La Matricula o La Contraseña son incorrectos.'));
                }

            } else {
                // el nombre no esta en la BD
                return done(null, false, req.flash('authmessage', 'La Matricula o La Contraseña son incorrectos.'));
            }

        });

    }));

};*/
