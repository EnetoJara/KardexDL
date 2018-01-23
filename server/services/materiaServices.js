var MateriaDAO = require('../database/DAOS/materiaDAO');
var CarrerasDAO = require('../database/DAOS/carreraDAO');
var CiclosDAO = require('../database/DAOS/cicloDAO');

var MateriaServices = class MateriaServices {
    constructor() {}

    getDefaults(carrera) {
        var materia = new MateriaDAO();
        return materia.getDefaults(carrera)
            .then(function (result) {
                materia = null;
                return result;
            });
    }

    registrarMateria(MATERIA) {
        var materia = new MateriaDAO();
        return materia.getID(MATERIA.CARRERA_ID)
            .then(function (idCarrera) {
                if (parseInt(idCarrera[0].ID) > 0) {
                    MATERIA.CARRERA_ID = idCarrera[0].ID;
                    return materia.insertar(MATERIA)
                        .then(function (result) {
                            return result;
                        });
                } else {
                    return false;
                }
            }).fail(function (error) {
                return error;
            });
    }

    eliminarMateria(params) {
        var materia = new MateriaDAO();

        return materia.eliminar(params).then(function (result) {
            materia = null;
            return result;
        }).fail(function (error) {
            materia = null;
            return error;
        });
    }

    activarMateria(params) {
        var materia = new MateriaDAO();

        return materia.activar(params).then(function (result) {
            materia = null;
            return result;
        }).fail(function (error) {
            materia = null;
            return error;
        });
    }

    getMateriaById(params) {
        var materia = new MateriaDAO();
        var toReturn = {};
        return materia.getMateriaById(params).then(function (subject) {
            toReturn.MATERIA = subject;
            return materia.getDefaults(params.CARRERA).then(function (defaults) {
                toReturn.DEFAULTS = defaults;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                materia = null;
            });
        })
    }

    postEditar(params) {
        var materia = new MateriaDAO();
        var toReturn = {};
        return materia.getID(params.CARRERA).then(function (result) {
            params.CARRERA = parseInt(result[0].ID);
            return materia.actualizar(params);
        }).then(function (result) {
            toReturn.SUCCESS = result;
            toReturn.ID = params.CARRERA;
            materia = null;
            return toReturn;
        }).fail(function (error) {
            toReturn.ID = params.CARRERA;
            toReturn.ERROR = error;
            materia = null;
            return toReturn;
        });
    }

    getMateriasBySemestre(params) {
        var dao = new MateriaDAO();
        return dao.getMateriasBySemestre(params)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error
            }).fin(function () {
                dao = null;
            });
    }

    asignarMaterias(params) {
        var dao = new MateriaDAO();
        var daoCarrera = new CarrerasDAO();
        var auxMaterias = [];
        var formatedArray = [];
        if (typeof params.MATERIAS === 'string') {
            auxMaterias.push(params.MATERIAS);
        } else {
            auxMaterias = params.MATERIAS;
        }
        for (var i = 0; i < auxMaterias.length; i++) {
            formatedArray.push({
                TURNO: params.TURNO,
                CARRERA: params.CARRERA,
                MATERIA: auxMaterias[i],
                MAESTRO: params.MAESTRO
            });
        }

        return daoCarrera.getCicloActual(formatedArray[0].CARRERA)
            .then(function (idCicloActual) {
                var toReturn = [];
                var Q = require('q');
                var defer = Q.defer();
                var ciclo = function (count) {
                    return dao.asignarMateriasMaestro(formatedArray[count], idCicloActual[0].ID)
                        .then(function (result) {
                            toReturn.push(result);
                            return toReturn;
                        }).finally(function () {
                            if (count === formatedArray.length - 1) {
                                defer.resolve(toReturn);
                            } else {
                                ciclo(++count);
                            }
                        });
                }
                ciclo(0);
                return defer.promise;
            }).fail(function (error) {
                return error;
            }).fin(function () {

            });
    }

    designarMarteria(id) {
        var dao = new MateriaDAO();

        return dao.designarMarteria(id)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    getdefaultAcademico(idCarrera, role) {
        var dao = new MateriaDAO();
        var daoCarrera = new CarrerasDAO();
        var daoCiclos = new CiclosDAO();
        var toReturn = {};
        if (role === 'CONTROLESCOLAR') {
            return daoCarrera.getCarrerasMaestro()
                .then(function (carreras) {
                    toReturn.CARRERAS = carreras;
                    return daoCarrera.getTurnos();
                }).then(function (turnos) {
                    toReturn.TURNOS = turnos;
                    return dao.getSemestres();
                }).then(function (semestres) {
                    toReturn.SEMESTRES = semestres;
                    return daoCiclos.getCicloActual(idCarrera);
                }).then(function (ciclos) {
                    toReturn.CICLOS = ciclos;
                    return toReturn;
                }).fail(function (error) {
                    return error;
                }).fin(function () {
                    dao = null;
                    daoCarrera = null;
                    toReturn = null;
                    daoCiclos = null;
                });
        } else {
            return daoCarrera.getCarrerasMaestro()
                .then(function (carreras) {
                    toReturn.CARRERAS = carreras;
                    return daoCarrera.getTurnos();
                }).then(function (turnos) {
                    toReturn.TURNOS = turnos;
                    return dao.getSemestres();
                }).then(function (semestres) {
                    toReturn.SEMESTRES = semestres;
                    return daoCiclos.getCiclosActivos();
                }).then(function (ciclos) {
                    toReturn.CICLOS = ciclos;
                    return toReturn;
                }).fail(function (error) {
                    return error;
                }).fin(function () {
                    dao = null;
                    daoCarrera = null;
                    toReturn = null;
                    daoCiclos = null;
                });
        }
    }
};
module.exports = MateriaServices;
