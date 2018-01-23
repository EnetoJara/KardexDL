var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var CicloDAO = class CicloDAO {
    contructor()
    {}

    getCiclos()
    {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CICLOS_ADMIN();', null, function (error, rows, fields) {
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

    insertar(CICLO)
    {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_INSERT_CODIGO(?,?,?,?);', [
                CICLO.CODIGO,
                CICLO.FECHAINI,
                CICLO.FECHAFINI,
                CICLO.EDITOR
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

    eliminar(params)
    {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_DELETE_CICLOESCOLAR(?,?);', [params._ID, params._EDITOR], function (error, rows, fields) {
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

    activar(params)
    {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_UPDATE_CICLO(?,?,?);', [params._ID, params._VALIDO, params._EDITOR], function (error, rows, fields) {
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

    getCiclosActivos()
    {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_CICLOS();', null, function (error, rows, fields) {
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

    getCicloActual(idCarrera) {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                console.log('SP_CURRENCT_CICLO\n', err);
                db.end();
                defer.reject(err);
            }
            db.query('CALL SP_CURRENCT_CICLO(?);', idCarrera, function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log('SP_CURRENCT_CICLO\n', error);
                        db.end();
                        defer.reject(error);
                    });
                } else {
                    toReturn = rows[0];
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log('SP_CURRENCT_CICLO\n', error);
                                db.end();
                                defer.reject(error);
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

};
module.exports = CicloDAO;
