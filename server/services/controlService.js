var ControlDAO = require('../database/DAOS/controlDAO');
var SemestreDAO = require('../database/DAOS/semestreDAO');

var ControlService = class ControlService {
    constructor() {}

    verCalificaciones(id) {
        var dao = new ControlDAO();
        return dao.verCalificaciones(id)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    publicarNotas(id) {
        var dao = new ControlDAO();
        return dao.publicarNotas(id).then(function (result) {
            return result;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            dao = null;
        });
    }

    hacerPublicas(id, valor) {
        var dao = new ControlDAO();
        return dao.hacerPublicas(id, valor)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    permitirAsignarNotas(params) {
        var dao = new ControlDAO();

        return dao.permitirAsignarNotas(params)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    eliminarControl(id) {
        var dao = new ControlDAO();

        return dao.eliminarControl(id)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    getListaControl(params) {
        var dao = new ControlDAO();
        return dao.getControl(params)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    getEditControl(username) {
        var newPass = require('../middleware/encriptar');
        var pass = new newPass();
        var dao = new ControlDAO();
        return dao.getEditControl(username)
            .then(function (result) {
                result[0].PASS = pass.generatePsswrd();
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                newPass = null;
                pass = null;
            });
    }

    actualizarControl(params) {
        var Encriptar = require('../middleware/encriptar');
        var pass = new Encriptar();
        var dao = new ControlDAO();
        return pass.encript(params.PASS)
        .then(function (encriptada) {
            params.PASS = encriptada;
            return dao.actualizarControl(params);
        }).then(function (result) {
            return result;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            Encriptar = null;
            pass = null;
            dao = null;
        });
    }
    
    getNotaDelAlumno(params) {
        var toReturn = {};
        var semestreDao = new SemestreDAO();
        return semestreDao.getCiclosDelAlumno(params)
        .then(function (result) {
            toReturn.SEMESTRES = result;
            toReturn.MATERICULA = params.matricula;
            return toReturn;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            semestreDao = null;
            toReturn = null;
        });
    }
};
module.exports = ControlService;
