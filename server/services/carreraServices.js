var CarrerasDAO = require('../database/DAOS/carreraDAO');
var CiclosDAO = require('../database/DAOS/cicloDAO');

var carreraServices = class carreraServices {
    constructor() {}

    getCarreras() {
        var carrera = new CarrerasDAO();
        var ciclos = new CiclosDAO();
        var toReturn = {};
        return carrera.getCarreras()
            .then(function (listaDeCarreras) {
                toReturn.CARRERAS = listaDeCarreras;
                return ciclos.getCiclosActivos();
            }).then(function (ciclo) {
                toReturn.CICLOS = ciclo;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                carrera = null;
                ciclos = null;
                toReturn = null;
            });
    }

    registrarCarrera(CARRERA) {
        var carrera = new CarrerasDAO();
        return carrera.registrarCarrera(CARRERA)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                carrera = null;
            });
    }

    ajaxEliminar(id) {
        var carrera = new CarrerasDAO();
        return carrera.eliminar(id)
            .then(function (result) {
                carrera = null;
                return result;
            });
    }

    ajaxActivar(id) {
        var carrera = new CarrerasDAO();
        return carrera.activar(id)
            .then(function (result) {
                carrera = null;
                return result;
            });
    }

    getCarreraById(params) {
        var carrera = new CarrerasDAO();
        var ciclos = new CiclosDAO();
        var toReturn = {};
        return carrera.getCarreraById(params.CARRERA_ID)
            .then(function (result) {
                toReturn.CARRERAS = result;
                return ciclos.getCiclosActivos();
            }).then(function (ciclos) {
                toReturn.CICLOS = ciclos;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                carrera = null;
                toReturn = null;
                ciclos = null;
            });
    }

    actualizar(CARRERA) {
        var carrera = new CarrerasDAO();

        return carrera.actualizar(CARRERA).then(function (result) {
            return result;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            carrera = null;
        });
    }
};
module.exports = carreraServices;
