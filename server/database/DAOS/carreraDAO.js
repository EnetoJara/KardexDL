var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var carreraDAO = class carreraDAO {
    constructor() {}

    getCarrerasMaestro() {
        var defer = Q.defer();
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
                        db.end();
                        defer.resreject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
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
        });
        return defer.promise;
    }

    getCarreras() {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CARRERAS_ADMIN();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
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

    registrarCarrera(CARRERA) {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_INSERT_CARRERA(?,?,?);', [CARRERA.NOMBRE, CARRERA.EDITOR, CARRERA.CICLOACTUAL], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
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

    eliminar(params) {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_DELETE_CARRERA(?,?);', [params._ID, params._EDITOR], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
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

    activar(params) {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_UPDATE_CARRERA(?,?,?);', [params._ID, params._VALIDO, params._EDITOR], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
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

    getCarreraById(id) {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CARRERA(?);', parseInt(id), function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
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

    actualizar(CARRERA) {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_ACTUALIZAR_CARRERA(?,?,?,?);', [
                CARRERA.ID,
                CARRERA.NOMBRE,
                CARRERA.EDITOR,
                CARRERA.CICLOACTUAL
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
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

    getTurnos() {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_TURNOS();', null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.resolve(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
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
        });
        return defer.promise;
    }

    getCicloActual(id) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CICLO_ACTUAL(?);', id, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(error);
                        db.end();
                        defer.reject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
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
        });
        return defer.promise;
    }

};
module.exports = carreraDAO;
