var MaestroServices = require('../services/maestroServices');

exports.buscarMaterias = function (req, res, next) {
    var service = new MaestroServices();

    return service.getCarreras()
        .then(function (result) {
            return res.render('./template/buscarMateriasAsignadas', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        });
};

exports.detalleMaterias = function (req, res, next) {
    var service = new MaestroServices();

    return service.getCarreras()
        .then(function (result) {
            return res.render('./template/detalleMateriasAsignadas', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        });
};

exports.getDetalleMateriasDelMaestro = function (req, res, next) {
    var toSend = {
        CARRERA: req.body.calificarCarrera,
        MAESTRO: req.user.idRole
    };
    var service = new MaestroServices();

    return service.getMateriasDelMaestro(toSend)
        .then(function (result) {
            return res.render('./template/listaMateriasMaestroDetalles', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });

        }).fin(function () {
            service = null;
            toSend = null;
        });
};

exports.getMateriasDelMaestro = function (req, res, next) {
    var toSend = {
        CARRERA: req.body.calificarCarrera,
        MAESTRO: req.user.idRole
    };
    var service = new MaestroServices();

    return service.getMateriasDelMaestro(toSend)
        .then(function (result) {
            return res.render('./template/listaMateriasMaestro', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });

        }).fin(function () {
            service = null;
            toSend = null;
        });
};

exports.darCalificacion = function (req, res, next) {
    var toSend = {
        MAESTRO: req.user.idRole,
        MATERIA: req.params.idMateria,
        TURNO: req.params.idTurno
    };
    var service = new MaestroServices();
    return service.getDefaultsAsignar(toSend)
        .then(function (result) {
            if (result.DEFAULTS.length > 0 && result.ALLOW === 1) {
                return res.render('./template/NotaMateria', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                req.flash('authmessage', 'Puede que esta Opcion no esté valida aun, contacta a Control Escolar.');
                return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR en el Sistema');
            return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            toSend = null;
            service = null;
        });
};

exports.grupoCalificado = function (req, res, next) {
    var toSend = {
        params: req.body,
        MAESTRO_ID: req.user.idRole,
        EDITOR: req.user.usuario
    }
    var service = new MaestroServices();
    return service.guardarCalificacion(toSend)
        .then(function (result) {
            if (result === true) {
                req.flash('info', 'Se ha registrado la calificación correctamente!');
                return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                req.flash('authmessage', 'ERROR: NO sepudo asignar calificación (YnY)!');
                return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fin(function () {
            toSend = null;
            service = null;
        });
};

exports.actualizarNota = function (req, res, next) {
    var service = new MaestroServices();
    var toSend = {
        MATERIA: req.params.id,
        MAESTRO: req.user.idRole,
        TURNO: req.params.idTurno
    };
    return service.actualizarNota(toSend)
        .then(function (result) {
            if (result.DEFAULTS.length > 0) {
                return res.render('./template/editarNota', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                return res.redirect('/' + toSend.TURNO + '/calificar/' + toSend.MATERIA, '/' + toSend.TURNO + '/calificar/' + toSend.MATERIA, {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            console.log(error);
            req.flash('authmessage', 'ERROR: Favor de contactar al adminsitrador!');
            return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            toSend = null;
            service = null;
        });
};

exports.detalleNota = function (req, res, next) {
    var service = new MaestroServices();
    var toSend = {
        MATERIA: req.params.id,
        MAESTRO: req.user.idRole,
        TURNO: req.params.idTurno
    };
    return service.actualizarNota(toSend)
        .then(function (result) {
            if (result.DEFAULTS.length > 0) {
                return res.render('./template/notaDetallerMateria', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                return res.redirect('/' + toSend.TURNO + '/calificar/' + toSend.MATERIA, '/' + toSend.TURNO + '/calificar/' + toSend.MATERIA, {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            console.log(error);
            req.flash('authmessage', 'ERROR: Favor de contactar al adminsitrador!');
            return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            toSend = null;
            service = null;
        });
};

exports.actualizarCalificacion = function (req, res, next) {
    var service = new MaestroServices();

    return service.actualizarCalificacion(req.body, req.user.usuario)
        .then(function (result) {
            if (result === true) {
                req.flash('info', 'Se ha registrado la calificación correctamente!');
                return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                req.flash('authmessage', 'ERROR: NO sepudo asignar calificación (YnY)!');
                return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor de contactar al adminsitrador!');
            return res.redirect('/asignarCalificacion', '/asignarCalificacion', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
        });
};

exports.eliminarMaestro = function (req, res, next) {
    var toSend = {
        id: req.body.id,
        editor: req.user.usuario
    };
    var service = new MaestroServices();

    return service.eliminarMaestro(toSend)
        .then(function (result) {
            res.json(result);
        }).fail(function (error) {
            res.json(error);
        }).fin(function () {
            service = null;
            toSend = null;
        });
};

exports.activarMaestro = function (req, res, next) {
  var toSend = {
      id: req.body.id,
      editor: req.user.usuario
  };
  var service = new MaestroServices();

  return service.activarMaestro(toSend)
      .then(function (result) {
          res.json(result);
      }).fail(function (error) {
          res.json(error);
      }).fin(function () {
          service = null;
          toSend = null;
      });
};
