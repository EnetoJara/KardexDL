var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var SemestreDAO = class SemestreDAO {
    constructor() {}

    getSemestres() {
        var defer = Q.defer();
        var db;
        var toReturn;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL GET_SEMESTRES_ADMIN();', null, function (error, rows, fields) {
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
    
    getCiclosDelAlumno(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.reject(err);
            }
            db.query('CALL SP_HISTORIAL_ACADEMICO(?,?);', [params.matricula, params.idCarrera], function (error, rows, fields) {
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
module.exports = SemestreDAO;
