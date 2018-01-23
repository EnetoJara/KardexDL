var mySQL = require('mysql');
var Q = require('q');


var userDAO = class userDAO {

    constructor() {}

    insertarUsuario(USER) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                throw err;
            }
            db.query('CALL SP_INSERT_USUARIO(?,?,?,?,?,?,?,?,?,?,?);', [
                USER._NOMBRE,
                USER._SNOMBRE,
                USER._APATERNO,
                USER._AMATERNO,
                USER._USERNAME,
                USER._PSSWRD,
                USER._CARRERA_ID,
                USER._TIPOUSER,
                USER._SEMESTRE_ID,
                USER._TURNO_ID,
                USER._EDITOR
            ], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    return db.rollback(function () {
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            console.log(error);
                            return db.rollback(function () {
                                db.end();
                                defer.resolve(error);
                            });
                        } else {
                            db.end();
                            defer.resolve(true);
                        }
                    });
                }

            });
        });

        return defer.promise;
    }

    getDefaultsRegistrar() {

        var defer = Q.defer();
        var config = require('../config');
        var db;
        var toReturn = {};
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CARRERAS();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.CARRERAS = rows[0];
                }
            });

            db.query('CALL GET_SEMESTRES();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {

                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.SEMESTRES = rows[0];
                }
            });

            db.query('CALL GET_TURNOS();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.TURNOS = rows[0];
                }
            });

            db.commit(function (error) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    db.end();
                    defer.resolve(toReturn);
                }
            });
        });

        return defer.promise;
    }

    getUsuario(USER) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL GET_USUARIO(?);', USER.USUARIO, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                var auxUser = results[0];
                                defer.resolve(auxUser[0]);
                            }
                        });
                    }
                });
            }
        });

        return defer.promise;
    }

    actualizarPassword(USER) {

        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL UPDATE_PASSWORD_USUARIO(?,?,?,?,?)', [
                    USER.ID,
                    USER.ROLE_ID,
                    USER.NEWPSSWRD,
                    USER.EDITOR,
                    USER.ROLE
                ], function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(err);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(true);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    getDefaultAlumno() {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        var toReturn = {};
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }

            db.query('CALL GET_SEMESTRES();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {

                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.SEMESTRES = rows[0];
                }
            });

            db.query('CALL GET_TURNOS();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.TURNOS = rows[0];
                }
            });

            db.commit(function (error) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    db.end();
                    defer.resolve(toReturn);
                }
            });
        });

        return defer.promise;
    }

    getListaDeAlumnos(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_LIST_ALUMNOS(?,?,?);', [params.CARRERA_ID, params.TURNO_ID, params.SEMESTRE_ID], function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(rows);
                            }
                        });
                    }
                });
            }
        });

        return defer.promise;
    }

    eliminarAlumno(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_DELETE_USER(?,?,?);', [
                    params.MATRICULA,
                    params.EDITOR,
                    params.TIPO
                    ], function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(true);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    activarAlumno(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_ACTIVAR_USER(?,?,?);', [
                    params.MATRICULA,
                    params.EDITOR,
                    params.TIPO
                    ], function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(true);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    getUserByMatricula(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_GET_USER(?,?);', [
                    params.MATRICULA,
                    params.TIPO
                    ], function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(rows[0]);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    actualizaAlumno(ALUMNO) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_UPDATE_USER(?,?,?,?,?,?,?,?,?,?,?,?);', [
                    ALUMNO._P_ID,
                    ALUMNO._A_ID,
                    ALUMNO._NOMBRE,
                    ALUMNO._SEGUNDO,
                    ALUMNO._PATERNO,
                    ALUMNO._MATERNO,
                    ALUMNO._SEMESTRE,
                    ALUMNO._TURNO,
                    ALUMNO._CONFIRMAR,
                    ALUMNO._CARRERA_ID,
                    ALUMNO._EDITOR,
                    ALUMNO._TIPO
                ], function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(true);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    getMaestros(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_GET_MAESTROS(?, ?, ?);', [
                    params.NUMERO,
                    params.NOMBRE,
                    params.APELLIDO
                    ], function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(rows[0]);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    getIdMaestro(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_GET_MAESTRO_ID(?);', params.MATRICULA, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(rows[0]);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    getmateriasByMaestro(maestro, carrera) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.resolve(err);
                });
            } else {
                db.query('CALL SP_GET_MATERIAS_POR_MAESTRO(?, ?);', [maestro, carrera], function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.resolve(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.resolve(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(rows[0]);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }

    verAsignacion(params) {
        var defer = Q.defer();
        var config = require('../config');
        var db;
        db = mySQL.createConnection(config);

        db.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                return db.rollback(function () {
                    db.end();
                    defer.reject(err);
                });
            } else {
                db.query('CALL SP_VER_ASIGNACIONES(?, ?, ?, ?);', [
                    params.CARRERA,
                    params.TURNO,
                    params.SEMESTRE,
                    params.CICLO
                    ], function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return db.rollback(function () {
                            db.end();
                            defer.reject(error);
                        });
                    } else {
                        db.commit(function (error) {
                            if (error) {
                                console.log(error);
                                return db.rollback(function () {
                                    db.end();
                                    defer.reject(error);
                                });
                            } else {
                                db.end();
                                defer.resolve(rows[0]);
                            }
                        });
                    }
                });
            }
        });
        return defer.promise;
    }
};
module.exports = userDAO;
