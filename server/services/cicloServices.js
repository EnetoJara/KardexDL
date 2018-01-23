var CicloDAO = require('../database/DAOS/cicloDAO');

var CicloServices = class CicloServices {
    constructor() {}

    getCiclos() {
        var Ciclo = new CicloDAO();

        return Ciclo.getCiclos()
            .then(function (result) {
                Ciclo = null;
                return result;
            });
    }

    registarCiclo(CICLO) {
        var Ciclo = new CicloDAO();

        return Ciclo.insertar(CICLO)
            .then(function (result) {
                Ciclo = null;
                return result;
            }).fail(function (error) {
                Ciclo = null;
                return error;
            });
    }

    ajaxActivar(params) {
        var Ciclo = new CicloDAO();

        return Ciclo.activar(params)
            .then(function (result) {
                Ciclo = null;
                return result;
            });
    }

    ajaxEliminar(params) {
        var Ciclo = new CicloDAO();
        return Ciclo.eliminar(params)
            .then(function (result) {
                Ciclo = null;
                return result;
            });
    }
};
module.exports = CicloServices;
