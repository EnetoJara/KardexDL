var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var AlumnoDAO = class AlumnoDAO {
    constructor() {}

    verMisMaterias(idAlumno) {
        var self = this;
        return self.runQuery('CALL SP_MY_SUBJECTS(' + idAlumno + ');')
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    resumenNotas(idAlumno) {
        var self = this;
        return self.runQuery('CALL PS_ALLOW_NOTAS(' + idAlumno + ')')
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    viewNotas(id, ciclo, semestre) {
        var self = this;
        return self.runQuery('CALL SP_VIEW_CALIFICACION(' + id + ', ' + ciclo + ', ' + semestre + ')')
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    getAlumnoInfo(id) {
        var self = this;
        var query = 'SELECT A.ID AS A_ID, P.USERNAME AS MATRICULA, P.NOMBRE, P.SNOMBRE, ' +
            'P.APATERNO, P.AMATERNO, S.NOMBRE AS SEMESTRE ' +
            'FROM PERSONA AS P ' +
            'INNER JOIN ALUMNO AS A ON P.ID = A.PERSONA_ID ' +
            'INNER JOIN SEMESTRE AS S ' +
            'ON A.SEMESTRE_ID = S.ID ' +
            'WHERE A.ID = ' + id;
        return self.runQuery(query)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
                query = null;
            });
    }

    getPosiblesAlumnos(params) {
        var defer = Q.defer();
        var db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.reject(err);
            }
            db.query('CALL SP_LIST_ALUMNS(?,?,?,?)', [params.MATRICULA, params.NOMBRE, params.APELLIDO, params.idCarrera], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log('SP_LIST_ALUMNS' + '\n', error);
                        defer.reject(error);
                    });
                } else {
                    db.commit(function (error) {
                        if (error) {
                            return db.rollback(function () {
                                console.log('SP_LIST_ALUMNS' + '\n', error);
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

    resultadoDelSemestre(params) {
        var self = this;
        return self.runQuery('CALL SP_GET_HISTORIAL(' + params.ID + ', ' + params.SEMESTRE + ');')
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
            });
    }

    getAlumno(idAlumno) {
        var self = this;
        var query = 'SELECT * FROM v_student WHERE ID = ' + idAlumno;
        return self.runQuery(query)
            .then(function (result) {
                return result;
            }).fail(function (error) {
                return error;
            }).fin(function () {
                self = null;
                query = null;
            });
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
module.exports = AlumnoDAO;
