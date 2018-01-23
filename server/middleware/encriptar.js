var bcrypt = require('bcryptjs');
var Q = require('q');

var encriptar = class encriptar {
    constructor() {}

    encript(pwd) {
        var defer = Q.defer();
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(pwd, salt, function (err, hash) {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(hash);
                }
            });
        });
        return defer.promise;
    }

    validarPassword(comparar, encriptada) {
        var defer = Q.defer();
        bcrypt.compare(comparar, encriptada)
            .then(function (res) {
                defer.resolve(res);
            });
        return defer.promise;
    }

    generatePsswrd() {
        var psswrd = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++) {
            psswrd += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return psswrd;
    }

    newArray(param) {
        var defer = Q.defer();
        var infinito = true;
        var newFormatedArray = [];
        for (var i = 0; infinito === true; i++) {
            if (param.params["notaMaestroPrimerParcial[" + i + "]"] !== undefined) {
                newFormatedArray.push({
                    MHM_ID: param.params['MHM_ID[' + i + ']'],
                    A_ID: param.params["notaMaestroID[" + i + "]"],
                    PSEMESTRE: param.params["notaMaestroPrimerParcial[" + i + "]"],
                    SSEMESTRE: param.params["notaMaestroSegundoParcial[" + i + "]"],
                    TSEMESTRE: param.params["notaMaestroTercerParcial[" + i + "]"],
                    PASO: param.params["notaMaestroPaso[" + i + "]"],
                    SIGLAS: param.params["notaMaestroSiglas[" + i + "]"],
                    SIGNIFICADO: (param.params["notaMaestroComentario[" + i + "]"]) ? param.params["notaMaestroComentario[" + i + "]"] : null,
                    ALUMNO_has_MATERIA_ID: NaN,
                    CARRERA_ID: param.params.carreraId,
                    MATERIA_ID: param.params.materiaId,
                    TURNO_ID: param.params.turnoId,
                    MAESTRO_ID: param.MAESTRO_ID,
                    EDITOR: param.EDITOR,
                    CICLOESCOLAR_ID: param.params.notaMaestroCiclo
                });
            } else {
                defer.resolve(newFormatedArray);
                infinito = false;
            }
        }
        return defer.promise;
    }

    arrayEditado(param, editor) {
        var defer = Q.defer();
        var infinito = true;
        var newFormatedArray = [];
        for (var i = 0; infinito === true; i++) {
            if (param["notaMaestroPrimerParcial[" + i + "]"] !== undefined) {
                newFormatedArray.push({
                    CALIFICACION_ID: param["notaEditarMaestroID[" + i + "]"],
                    PSEMESTRE: param["notaMaestroPrimerParcial[" + i + "]"],
                    SSEMESTRE: param["notaMaestroSegundoParcial[" + i + "]"],
                    TSEMESTRE: param["notaMaestroTercerParcial[" + i + "]"],
                    PASO: param["notaMaestroPaso[" + i + "]"],
                    SIGLAS: param["notaMaestroSiglas[" + i + "]"],
                    SIGNIFICADO: (param["notaMaestroComentario[" + i + "]"]) ? param["notaMaestroComentario[" + i + "]"] : null,
                    EDITOR: editor
                });
            } else {
                defer.resolve(newFormatedArray);
                infinito = false;
            }
        }
        return defer.promise;
    }

};
module.exports = encriptar;
