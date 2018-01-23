var mySQL = require('mysql');
var Q = require('q');
var config = require('../config');

var MaestroDAO = class MaestroDAO {

    constructor() {}

    getMateriasDelMaestro(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_LIST_MATERIAS_MAESTRO(?, ?);', [params.CARRERA, params.MAESTRO], function (error, rows, fields) {
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

    getDefaultsAsignar(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_ASIGNAR_NOTA(?, ?, ?);', [params.MAESTRO, params.MATERIA, params.TURNO], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log("SP_ASIGNAR_NOTA\n", error);
                        db.end();
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

    allowAsingar(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_ALLOW_ASIGNAR(?);', params.MATERIA, function (error, rows, fields) {
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
    getCiclos() {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_GET_CICLOS();', null, function (error, rows, fields) {
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

    insertarMateriasMaestro(CALI) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_INSERT_NOTA(?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [
                CALI.A_ID,
                CALI.CARRERA_ID,
                CALI.CICLOESCOLAR_ID,
                CALI.EDITOR,
                CALI.MHM_ID,
                CALI.MATERIA_ID,
                CALI.PASO,
                CALI.PSEMESTRE,
                CALI.SIGLAS,
                CALI.SIGNIFICADO,
                CALI.SSEMESTRE,
                CALI.TSEMESTRE,
                CALI.TURNO_ID,
                CALI.TOTAL
                     ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log("SP_INSERT_NOTA\n", error);
                        db.end();
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

    actualizarNota(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_EDIT_NOTAS(?, ?);', [params.MATERIA, params.MAESTRO], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log("SP_EDIT_NOTAS\n", error);
                        db.end();
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

    actualizarCalificacion(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_UPDATE_NOTE(?, ?,?, ?,?, ?,?, ?, ?);', [
                params.CALIFICACION_ID,
                params.PSEMESTRE,
                params.SSEMESTRE,
                params.TSEMESTRE,
                params.TOTAL,
                params.PASO,
                params.SIGLAS,
                params.SIGNIFICADO,
                params.EDITOR
            ], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log('SP_UPDATE_NOTE\n', error);
                        db.end();
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

    eliminarMaestro(params) {
        var defer = Q.defer();
        var db;
        db = mySQL.createConnection(config);
        db.beginTransaction(function (err) {
            if (err) {
                db.end();
                defer.resolve(err);
            }
            db.query('CALL SP_DELETE_MAESTRO(?, ?);', [params.id, params.editor], function (error, rows, fields) {
                if (error) {
                    return db.rollback(function () {
                        console.log("SP_DELETE_MAESTRO\n", error);
                        db.end();
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

    activarMaestro(params) {
      console.log('ENTRE A activarMaestro');
      var defer = Q.defer();
      var db;
      db = mySQL.createConnection(config);
      db.beginTransaction(function (err) {
          if (err) {
              db.end();
              defer.resolve(err);
          }
          db.query('CALL SP_ACTIVAR_MAESTRO(?, ?);', [params.id, params.editor], function (error, rows, fields) {
              if (error) {
                  return db.rollback(function () {
                      console.log("SP_ACTIVAR_MAESTRO\n", error);
                      db.end();
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
};
module.exports = MaestroDAO;
