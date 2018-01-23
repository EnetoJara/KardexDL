var CarrerasDAO = require('../database/DAOS/carreraDAO');
var MaestroDAO = require('../database/DAOS/maestroDAO');
var Encriptar = require('../middleware/encriptar');
var Q = require('q');


var MaestroService = class MaestroService {
    contructor() {}

    getCarreras() {
        var dao = new CarrerasDAO();
        var toReturn = {};
        return dao.getCarrerasMaestro()
            .then(function (result) {
                toReturn.CARRERAS = result;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                toReturn = null;
            });
    }

    getMateriasDelMaestro(params) {
        var dao = new MaestroDAO();
        var carrerasDAO = new CarrerasDAO();
        var toReturn = {};
        return dao.getMateriasDelMaestro(params)
            .then(function (result) {
                toReturn.MATERIAS = result;
                return carrerasDAO.getCarrerasMaestro();
            }).then(function (carreras) {
                toReturn.CARRERAS = carreras;
                return toReturn;
            }).fin(function () {
                dao = null;
                carrerasDAO = null;
                toReturn = null;
            });
    }

    getDefaultsAsignar(params) {
        var dao = new MaestroDAO();
        var toReturn = {};
        return dao.getDefaultsAsignar(params)
            .then(function (result) {
                toReturn.DEFAULTS = result;
                return dao.getCiclos();
            }).then(function (ciclos) {
                toReturn.CICLOS = ciclos;
                return dao.allowAsingar(params);
            }).then(function (allow) {
                toReturn.ALLOW = allow[0].RESTRINGIR;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                toReturn = null;
            });
    }

    guardarCalificacion(param) {
        var encriptar = new Encriptar();
        var dao = new MaestroDAO();
        var toSend = {};
        var toReturn;
        return encriptar.newArray(param)
            .then(function (notas) {
                toSend = notas;
                var defer = Q.defer();
                var ciclo = function (index) {
                    toSend[index].TOTAL = ((parseFloat(toSend[index].PSEMESTRE) + parseFloat(toSend[index].SSEMESTRE) + parseFloat(toSend[index].TSEMESTRE)) / 3).toFixed(2);
                    return dao.insertarMateriasMaestro(toSend[index])
                        .then(function (result) {
                            toReturn = result;
                            return toReturn;
                        }).finally(function () {
                            if (index === toSend.length - 1) {
                                defer.resolve(toReturn);
                            } else {
                                ciclo(++index);
                            }
                        });
                };
                ciclo(0);
                return defer.promise;
            }).then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                encriptar = null;
                toSend = null;
                toReturn = null;
                dao = null;
            });

    }

    actualizarNota(params) {
        var dao = new MaestroDAO();
        var toReturn = {};
        return dao.actualizarNota(params)
            .then(function (result) {
                toReturn.DEFAULTS = result;
                return dao.getCiclos();
            }).then(function (ciclos) {
                toReturn.CICLOS = ciclos;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                toReturn = null;
            });
    }

    actualizarCalificacion(body, editor) {
        var encriptar = new Encriptar();
        var dao = new MaestroDAO();
        var toReturn;
        var defer;

        return encriptar.arrayEditado(body, editor)
            .then(function (result) {
                toReturn = result;
                defer = Q.defer();
                var ciclo = function (index) {
                    toReturn[index].TOTAL = ((parseFloat(toReturn[index].PSEMESTRE) + parseFloat(toReturn[index].SSEMESTRE) + parseFloat(toReturn[index].TSEMESTRE)) / 3).toFixed(2);
                    return dao.actualizarCalificacion(toReturn[index])
                        .then(function (n) {
                            return n;
                        }).finally(function () {
                            if (index === toReturn.length - 1) {
                                defer.resolve(true);
                            } else {
                                ciclo(++index);
                            }
                        });
                };
                ciclo(0);
                return defer.promise;
            }).then(function (listaDeNotas) {
                return listaDeNotas;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                encriptar = null;
                dao = null;
                toReturn = null;
                defer = null;
            });
    }

    eliminarMaestro(params) {
        var dao = new MaestroDAO();
        return dao.eliminarMaestro(params)
        .then(function (result) {
            return result;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            dao = null;
        });
    }

    activarMaestro(params) {
      var dao = new MaestroDAO();
      return dao.activarMaestro(params)
      .then(function (result) {
          return result;
      }).fail(function (error) {
          return error;
      }).fin(function () {
          dao = null;
      });
    }
};
module.exports = MaestroService;
