var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var MateriaDAO = class MateriaDAO {
    constructor() {}

    getDefaults(carrera) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        var toReturn = {};
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

            db.query('CALL GET_MATERIAS(?);', carrera, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {

                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.MATERIAS = rows[0];
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

    getID(nombre) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        var toReturn = {};
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CARRERA_ID(?);', nombre, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {

                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
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
                }
            });
        });

        return defer.promise;
    }

    insertar(MATERIA) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        var toReturn = {};
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_INSERT_MATERIA(?,?,?,?);', [
                MATERIA.NOMBRE,
                MATERIA.CARRERA_ID,
                MATERIA.SEMESTRE_ID,
                MATERIA.EDITOR
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {

                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.SEMESTRES = rows[0];
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
                                db.end();
                                defer.resolve(error);
                            });
                        } else {
                            db.end();
                            var auxRows = (rows[0] !== undefined && rows[0][0] && rows[0][0].NUM) ? rows[0][0].NUM : 0;
                            if (parseInt(auxRows) === 1) {
                                var toReturn = {
                                    code: 'La materia ya existe.',
                                    errno: 666
                                };
                                defer.resolve(toReturn);
                            } else {
                                defer.resolve(true);
                            }

                        }
                    });
                }
            });
        });

        return defer.promise;
    }

    eliminar(params) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_DELETE_MATERIA(?,?);', [
                params.ID,
                params.EDITOR
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {

                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
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

    activar(params) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_ACTIVAR_MATERIA(?,?);', [
                params.ID,
                params.EDITOR
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
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

    getMateriaById(params) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_MATERIA(?);', [
                params.ID
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
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
        });

        return defer.promise;
    }

    actualizar(MATERIA) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        var toReturn = {};
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_UPDATE_MATERIA(?,?,?,?,?);', [
                MATERIA.ID,
                MATERIA.NOMBRE,
                MATERIA.CARRERA,
                MATERIA.SEMESTRE,
                MATERIA.EDITOR
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.resolve(error);
                    });
                } else {
                    toReturn.SEMESTRES = rows[0];
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
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

    getMateriasBySemestre(params) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_GET_MATERIAS_POR_SEMESTRE(?, ?, ?);', [
                params.SEMESTRE,
                params.CARRERA,
                params.TURNO
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log('SP_GET_MATERIAS_POR_SEMESTRE', error);
                        defer.resolve(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
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
        });

        return defer.promise;

    }

    asignarMateriasMaestro(params, idCicloActual) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_INSERT_MAESTRO_HAS_MATERIA(?, ?, ?, ?, ?);', [
                params.MAESTRO,
                params.TURNO,
                params.MATERIA,
                params.CARRERA,
                idCicloActual
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.reject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
                                db.end();
                                defer.reject(error);
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

    designarMarteria(id) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.reject(err);
            }
            db.query('CALL SP_QUITAR_MATERIA(?);', id, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.reject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
                                db.end();
                                defer.reject(error);
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

    getSemestres() {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.reject(err);
            }
            db.query('CALL GET_SEMESTRES();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        defer.reject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(error);
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
        });
        return defer.promise;
    }
};
module.exports = MateriaDAO;
