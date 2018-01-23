var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var ControlDAO = class ControlDAO {
    contructor() {}

    verCalificaciones(id) {
        var self = this;
        return self.runQuery('CALL SP_VER_CALIFICACION(' + id + ');')
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            });
    }

    publicarNotas(id) {
        var self = this;
        return self.runQuery('CALL SP_PUBLICAR_NOTAS(' + id + ');')
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    hacerPublicas(id, valor) {
        var self = this;
        return self.runQuery('CALL SP_UPDATE_PUBLICAR(' + id + ',' + valor + ');')
            .then(function (result) {
                return true;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    permitirAsignarNotas(params) {
        var self = this;
        return self.runQuery('CALL SP_RESTRINGIR_NOTAS(' + params.id + ',' + params.valor + ');')
            .then(function (result) {
                return true;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    eliminarControl(id) {
        var self = this;
        return self.runQuery("CALL SP_DELETE_CONTROL('" + id + "');")
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    getEditControl(id) {
        var self = this;
        return self.runQuery("CALL SP_EDIT_CONTROL('" + id + "');")
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    getControl(params) {
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
                db.query('CALL SP_GET_CONTROLES(?, ?, ?, ?);', [
                    params.NUMERO,
                    params.NOMBRE,
                    params.APELLIDO,
                    params.idCarrera
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

    actualizarControl(params) {
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
                db.query('CALL SP_UPDATE_USER(?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?);', [
                    params.P_ID,
                    params.C_ID,
                    params.NOMBRE,
                    params.SNOMBRE,
                    params.APATERNO,
                    params.AMATERNO,
                    null,
                    null,
                    params.PASS,
                    null,
                    params.EDITOR,
                    3
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

    runQuery(QUERY) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.reject(err);
            }
            db.query(QUERY, null, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log(QUERY + '\n', error);
                        defer.reject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log(QUERY + '\n', error);
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
    };
};

module.exports = ControlDAO;
