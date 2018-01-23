var UserDAO = require('../database/DAOS/usersDAO');
var Psswrd = require('../middleware/encriptar');
var MateriaService = require('./materiaServices');

var UserServices = class UserServices {

    constructor() {}

    insertarUsuario(USER) {
        var Encriptar = new Psswrd();
        var userDAO = new UserDAO();

        return Encriptar.encript(USER._PSSWRD)
            .then(function (pass) {
                USER._PSSWRD = pass;
                return userDAO.insertarUsuario(USER)
                    .then(function (success) {
                        return success;
                    }).fin(function () {
                        Encriptar = null;
                        userDAO = null;
                    });
            });
    }

    getDefaultsRegistrar() {
        var userBD = new UserDAO();
        var Encriptar = new Psswrd();
        var toReturn = {};

        return userBD.getDefaultsRegistrar()
            .then(function (data) {
                toReturn = data;
                toReturn.PSSWRDGENERADA = Encriptar.generatePsswrd();
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                userBD = null;
            });
    }

    actualizaPassword(USER) {
        var Encriptar = new Psswrd();
        var UserDB = new UserDAO();

        return UserDB.getUsuario(USER)
            .then(function (result) {
                return Encriptar.validarPassword(USER.PSSWRD, result.PSSWRD)
                    .then(function (valid) {
                        if (valid) {

                            return Encriptar.encript(USER.NEWPSSWRD)
                                .then(function (psswrdEncriptada) {
                                    USER.NEWPSSWRD = psswrdEncriptada;
                                    return UserDB.actualizarPassword(USER);
                                }).then(function (result) {
                                    return result;
                                }).fail(function (error) {
                                    return error;
                                });
                        } else {
                            return {
                                code: 'INVALID_PSSWRD',
                                errno: 5000
                            };
                        }
                    });
            }).fail(function (error) {
                return;
            });
    }

    getTurnosYSemestres() {
        var userDAO = new UserDAO();

        return userDAO.getDefaultAlumno().then(function (result) {
            return result;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            userDAO = null;
        });
    }

    getAlumnos(params) {
        var userDAO = new UserDAO();
        var toReturn = {
            TURNOS: null,
            SEMESTRES: null,
            ALUMNOS: null
        };
        return userDAO.getDefaultAlumno().then(function (result) {
            toReturn.TURNOS = result.TURNOS;
            toReturn.SEMESTRES = result.SEMESTRES;
            return userDAO.getListaDeAlumnos(params);
        }).then(function (alumnos) {
            toReturn.ALUMNOS = alumnos[0];
            return toReturn;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            userDAO = null;
        });
    }

    eliminarAlumno(params) {
        var userDAO = new UserDAO();
        return userDAO.eliminarAlumno(params).then(function (result) {
            return result;
        }).fail(function (error) {
            return error;
        }).fin(function () {
            userDAO = null;
        });
    }

    activarAlumno(params) {
        var userDAO = new UserDAO();
        return userDAO.activarAlumno(params)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                userDAO = null;
            });
    }

    getDetalleUsuario(params) {
        var userDAO = new UserDAO();
        var toReturn = {};
        var Encriptar = new Psswrd();
        if (params.TIPO === 1) {
            return userDAO.getDefaultsRegistrar()
                .then(function (result) {
                    toReturn = result;
                    return userDAO.getUserByMatricula(params);
                }).then(function (user) {
                    toReturn.USER = user;
                    toReturn.PSSWRDGENERADA = Encriptar.generatePsswrd();
                    return toReturn;
                }).fail(function (error) {
                    return error;
                }).fin(function () {
                    userDAO = null;
                    Encriptar = null;
                });

        } else {
            return userDAO.getDefaultsRegistrar()
                .then(function (result) {
                    toReturn = result;
                    return userDAO.getUserByMatricula(params);
                }).then(function (user) {
                    toReturn.USER = user;
                    toReturn.PSSWRDGENERADA = Encriptar.generatePsswrd();
                    return userDAO.getmateriasByMaestro(user[0].A_ID, params.CARRERA);
                }).then(function (carreras) {
                    toReturn.CARRERAS = carreras;
                    return toReturn;
                }).fail(function (error) {
                    return error;
                }).fin(function () {
                    userDAO = null;
                    Encriptar = null;
                });
        }

    }

    actualizarAlumno(params) {
        var dao = new UserDAO();
        var Encriptar = new Psswrd();

        return Encriptar.encript(params._CONFIRMAR)
            .then(function (encriptada) {
                params._CONFIRMAR = encriptada;
                return dao.actualizaAlumno(params);
            }).then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                Encriptar = null;
            });
    }

    getListaMetro(params) {
        var dao = new UserDAO();
        return dao.getMaestros(params)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
            });
    }

    getIdMaestro(params) {
        var dao = new UserDAO();
        var toReturn = {};

        return dao.getDefaultsRegistrar()
            .then(function (result) {
                toReturn = result;
                return dao.getIdMaestro(params);
            }).then(function (results) {
                toReturn.MAESTRO = results;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                dao = null;
                toReturn = null;
            });
    }

    verAsignacion(params, role) {
        var mate = new MateriaService();
        var dao = new UserDAO();
        var toReturn = {};

        return mate.getdefaultAcademico(params.idCarrera, role)
            .then(function (defaults) {
                toReturn = defaults;
                return dao.verAsignacion(params);
            }).then(function (tabla) {
                toReturn.TABLA = tabla;
                return toReturn;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                mate = null;
                dao = null;
                toReturn = null;
            });
    }
};
module.exports = UserServices;
