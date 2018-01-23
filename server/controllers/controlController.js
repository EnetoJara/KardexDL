var ControlService = require('../services/controlService');

exports.verCalificaciones = function (req, res, next) {
    var service = new ControlService();

    return service.verCalificaciones(req.params.idMateria)
        .then(function (result) {
            if (result.length > 0) {
                return res.render('./template/materiaCalificada', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                req.flash('authmessage', 'Aun no se ha calificado, favor de contactar al maestro.');
                return res.redirect('/planAcademico', '/planAcademico', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR en el sistema, favor de contactar al Administrador.');
            return res.redirect('/planAcademico', '/planAcademico', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
        })
};

exports.publicarNotas = function (req, res, next) {
    var service = new ControlService();
    return service.publicarNotas(req.user.idCarrera)
        .then(function (result) {
            return res.render('./template/publicarNotas', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        }).fail(function (error) {
            throw error;
        }).fin(function () {
            service = null;
        });
};

exports.hacerPublicas = function (req, res, next) {
    var service = new ControlService();
    return service.hacerPublicas(req.body.id, req.body.valor)
        .then(function (result) {
            res.json(result);
        }).fail(function (error) {
            res.json(error);
        }).fin(function () {
            service = null;
        });
};

exports.eliminarControl = function (req, res, next) {
    var service = new ControlService();

    return service.eliminarControl(req.body.id)
        .then(function (result) {
            res.json(true);
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor que contactar al administrador.');
            return res.redirect('/listaControl', '/listaControl', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
        });
};

exports.permitirAsignarNotas = function (req, res, next) {
    var service = new ControlService();
    var toSend = {
        id: req.body.id,
        valor: req.body.valor
    };
    return service.permitirAsignarNotas(toSend)
        .then(function (result) {
            res.json(true);
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR en el sistema, favor de contactar al Administrador.');
            return res.redirect('/hacerPublicas', '/hacerPublicas', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
        });
};

exports.getListaControl = function (req, res, next) {

    return res.render('./template/gestionarControl', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        message: req.flash('info'),
        er: req.flash('authmessage')
    });
};

exports.listaControl = function (req, res, next) {
    var toSend = {
        NUMERO: (req.body.maestroNum) ? '%' + req.body.maestroNum + '%' : null,
        NOMBRE: (req.body.maestroNombre) ? '%' + req.body.maestroNombre + '%' : null,
        APELLIDO: (req.body.maestroApellido) ? '%' + req.body.maestroApellido + '%' : null,
        idCarrera: req.user.idCarrera
    };
    var userService = new ControlService();

    userService.getListaControl(toSend).then(function (result) {
        return res.render('./template/listaControl', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('info'),
            er: req.flash('authmessage'),
            data: result
        });
    }).fail(function (error) {
        req.flash('authmessage', 'ERROR: Favor que contactar al administrador.');
        return res.redirect('/listaControl', '/listaControl', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    }).fin(function () {
        toSend = null;
        userService = null;
    });
};

exports.detalleControl = function (req, res, next) {
    var service = new ControlService();

    return service.getEditControl(req.params.idControl)
        .then(function (result) {
            if (result.length > 0) {
                return res.render('./template/controlDetalle', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                req.flash('authmessage', 'NO se ha encontrado a nadie en con ese numero de empleado.');
                return res.redirect('/listaControl', '/listaControl', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor que contactar al administrador.');
            return res.redirect('/listaControl', '/listaControl', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
        });
};

exports.actualizarControl = function (req, res, next) {
    var toSend = {
        NOMBRE: req.body.detallesNombre,
        SNOMBRE: (req.body.detallesSNombre) ? req.body.detallesSNombre : null,
        APATERNO: req.body.detallesPaterno,
        AMATERNO: (req.body.detallesMaterno) ? req.body.detallesMaterno : null,
        C_ID: req.body.C_ID,
        P_ID: req.body.P_ID,
        PASS: req.body.detalleConfirmar,
        EDITOR: req.user.usuario
    };
    var userService = new ControlService();
    userService.actualizarControl(toSend)
        .then(function (result) {
            req.flash('info', 'La información se ha actualizado correctamente.');
            return res.redirect('/listaControl', '/listaControl', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor que contactar al administrador.');
            return res.redirect('/listaControl', '/listaControl', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            toSend = null;
            userService = null;
        });
};

exports.verNotas = function (req, res, next) {
    var toSend = {
        matricula: req.params.idMatricula,
        idCarrera: req.user.idCarrera
    }
    var service = new ControlService();
    return service.getNotaDelAlumno(toSend)
        .then(function (result) {
            if (result.SEMESTRES.length > 0) {
                return res.render('./template/historialAlumno', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                req.flash('authmessage', 'El alumno con la matricula: \'' + toSend.matricula + '\' no fue encontrado.');
            return res.redirect('/buscarAlumno', '/buscarAlumno', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
            }
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor que contactar al administrador.');
            return res.redirect('/buscarAlumno', '/buscarAlumno', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
        });
};
