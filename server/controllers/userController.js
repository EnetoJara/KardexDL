var UserServices = require('../services/userServices');
var messageError = require('../services/error');

exports.registrar = function (req, res, next) {
    var UserService = new UserServices();
    return UserService.getDefaultsRegistrar()
        .then(function (defaults) {
            UserService = null;
            return res.render('./template/register', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                CARRERAS: defaults.CARRERAS,
                SEMESTRES: defaults.SEMESTRES,
                TURNOS: defaults.TURNOS,
                GPSSWRD: defaults.PSSWRDGENERADA
            });
        }).fail(function (error) {
            return res.render('./template/register', {
                message: req.flash('info'),
                er: req.flash('authmessage')
            });
        });

};

exports.registrarUsuario = function (req, res, next) {
    var userServices = new UserServices();
    var USER = {
        _NOMBRE: req.body.inputNombreRegistrar,
        _SNOMBRE: (req.body.inputSNombreRegistrar !== '') ? req.body.inputSNombreRegistrar.trim() : null,
        _APATERNO: req.body.inputAPaternoRegistrar,
        _AMATERNO: (req.body.inputAMaternoeRegistrar !== '') ? req.body.inputAMaternoeRegistrar.trim() : null,
        _USERNAME: req.body.inputUserNameRegistrar,
        _PSSWRD: (req.user.role === 'ADMIN') ? req.body.inputPasswordRegistrar : req.body.passwrd,
        _CARRERA_ID: (req.user.role === 'ADMIN') ? req.body.selectCarreraRegistrar : req.user.idCarrera,
        _TIPOUSER: req.body.selectRoleRegistrar,
        _SEMESTRE_ID: req.body.selectSemestreRegistrar,
        _TURNO_ID: req.body.selectTurnoRegistrar,
        _EDITOR: req.user.usuario
    };

    return userServices.insertarUsuario(USER)
        .then(function (success) {
            userServices = null;
            if (success === true) {
                req.flash('info', 'Se a registrado correctamente');
                return res.redirect('/registrar', '/registrar', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                var err = messageError.getError(success.code, success.errno);
                req.flash('authmessage', err);
                return res.redirect('/registrar', '/registrar', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        });
};

exports.getActualizar = function (req, res, next) {
    return res.render('./template/actualizarPassword', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        message: req.flash('info'),
        er: req.flash('authmessage')
    });
};

exports.actualizar = function (req, res, next) {
    var UserService = new UserServices();
    var USER = {
        ID: req.user.id,
        ROLE_ID: req.user.idRole,
        NOMBRE: req.user.nombre,
        USUARIO: req.user.usuario,
        PSSWRD: req.body.inputUpdatePassword,
        NEWPSSWRD: req.body.inputUpdateNewPwrd,
        EDITOR: req.user.nombre,
        ROLE: req.user.role
    };

    return UserService.actualizaPassword(USER)
        .then(function (result) {
            UserService = null;
            USER = null;
            if (result === true) {
                req.flash('info', 'Se a actualizado la contraseña correctamente.');
                return res.redirect('/actualizar', '/actualizar', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                req.flash('authmessage', messageError.getError(result.code, result.errno));
                return res.redirect('/actualizar', '/actualizar', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {

        });
};

exports.listaAlumno = function (req, res, next) {
    var userService = new UserServices();

    return userService.getTurnosYSemestres().then(function (result) {

        return res.render('./template/gestionarAlumno', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('info'),
            er: req.flash('authmessage'),
            data: result
        });
    }).fail(function (error) {
        throw error;
    }).fin(function () {
        userService = null;
    });
};

exports.getListaAlumnos = function (req, res, next) {
    var toSend = {
        CARRERA_ID: req.user.idCarrera,
        TURNO_ID: req.body.selectAlumnoTurno,
        SEMESTRE_ID: req.body.selectAlumnoSemestre
    };
    var userServices = new UserServices();
    return userServices.getAlumnos(toSend)
        .then(function (result) {
            return res.render('./template/listaAlumnos', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        }).fail(function (error) {
            throw error;
        }).fin(function () {
            userServices = null;
        });
};

exports.eliminarAlumno = function (req, res, next) {
    var userServices = new UserServices();
    var toStend = {
        MATRICULA: req.body.matricula,
        EDITOR: req.user.usuario,
        TIPO: 1
    };
    return userServices.eliminarAlumno(toStend)
        .then(function (result) {
            res.json(result);
        }).fail(function (error) {
            res.json(error);
        }).fin(function () {
            toStend = null;
            userServices = null;
        });
};

exports.activarAlumno = function (req, res, next) {
    var userServices = new UserServices();
    var toStend = {
        MATRICULA: req.body.matricula,
        EDITOR: req.user.usuario,
        TIPO: 1
    };
    return userServices.activarAlumno(toStend)
        .then(function (result) {
            res.json(result);
        }).fail(function (error) {
            res.json(error);
        }).fin(function () {
            toStend = null;
            userServices = null;
        });
};

exports.editarAlumno = function (req, res, next) {

    var userServices = new UserServices();
    //1-Alumno 2-Maestro 3-control
    var toSend = {
        MATRICULA: req.params.matricula,
        TIPO: 1
    };
    return userServices.getDetalleUsuario(toSend)
        .then(function (result) {
            if (result.USER.length > 0) {
                return res.render('./template/alumnoDetalle', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                req.flash('authmessage', 'MATRICULA incorrecta!');
                return res.redirect('/listaAlumno', '/listaAlumno', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', '(YnY) ERROR, Plis no hagas eso otra vez jijiji');
            return res.redirect('/listaAlumno', '/listaAlumno', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            userServices = null;
            toSend = null;
        });
};

exports.actualizarAlumno = function (req, res, next) {

    var PERSONA = {
        _P_ID: req.body.P_ID,
        _A_ID: req.body.A_ID,
        _NOMBRE: req.body.detallesNombre,
        _SEGUNDO: (req.body.detallesSNombre) ? req.body.detallesSNombre : null,
        _PATERNO: req.body.detallesPaterno,
        _MATERNO: (req.body.detallesMaterno) ? req.body.detallesMaterno : null,
        _SEMESTRE: req.body.detallesSemestre,
        _TURNO: req.body.detallesTurno,
        _CONFIRMAR: req.body.detalleConfirmar,
        _CARRERA_ID: req.user.idCarrera,
        _EDITOR: req.user.usuario,
        _TIPO: 1
    };
    var userService = new UserServices();

    return userService.actualizarAlumno(PERSONA)
        .then(function (result) {
            if (result === true) {
                req.flash('info', 'Se ha actualizado la información correctamente.');
                return res.redirect('/listaAlumno', '/listaAlumno', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                req.flash('authmessage', result.code + ' ' + result.errno);
                return res.redirect('/listaAlumno', '/listaAlumno', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {

        }).fin(function () {
            userService = null;
        });

};

exports.getListaMaestro = function (req, res, next) {

    return res.render('./template/gestionarMaestro', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        message: req.flash('info'),
        er: req.flash('authmessage')
    });
};

exports.listaMaestro = function (req, res, next) {

    var toSend = {
        NUMERO: (req.body.maestroNum) ? '%' + req.body.maestroNum + '%' : null,
        NOMBRE: (req.body.maestroNombre) ? '%' + req.body.maestroNombre + '%' : null,
        APELLIDO: (req.body.maestroApellido) ? '%' + req.body.maestroApellido + '%' : null,
        idCarrera: req.user.idCarrera
    };
    var userService = new UserServices();

    userService.getListaMetro(toSend).then(function (result) {
        return res.render('./template/listaMaestro', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('info'),
            er: req.flash('authmessage'),
            data: result
        });
    });
};

exports.editarMaestro = function (req, res, next) {
    var userServices = new UserServices();
    //1-Alumno 2-Maestro 3-control
    var toSend = {
        MATRICULA: req.params.maestro,
        TIPO: 2,
        CARRERA: req.user.idCarrera
    };
    return userServices.getDetalleUsuario(toSend)
        .then(function (result) {
            if (result.USER.length > 0) {
                return res.render('./template/maestroDetalle', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            } else {
                req.flash('authmessage', 'MATRICULA incorrecta!');
                return res.redirect('/listaMaestro', '/listaMaestro', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', '(YnY) ERROR, Plis no hagas eso otra vez jijiji');
            return res.redirect('/listaMaestro', '/listaMaestro', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            userServices = null;
            toSend = null;
        });
};

exports.actualizarMaestro = function (req, res, next) {

    var PERSONA = {
        _P_ID: req.body.P_ID,
        _A_ID: req.body.A_ID,
        _NOMBRE: req.body.detallesNombre,
        _SEGUNDO: (req.body.detallesSNombre) ? req.body.detallesSNombre : null,
        _PATERNO: req.body.detallesPaterno,
        _MATERNO: (req.body.detallesMaterno) ? req.body.detallesMaterno : null,
        _SEMESTRE: null,
        _TURNO: null,
        _CONFIRMAR: req.body.detalleConfirmar,
        _CARRERA_ID: null,
        _EDITOR: req.user.usuario,
        _TIPO: 2
    };
    var userService = new UserServices();

    return userService.actualizarAlumno(PERSONA)
        .then(function (result) {
            if (result === true) {
                req.flash('info', 'Se ha actualizado la información correctamente.');
                return res.redirect('/listaMaestro', '/listaMaestro', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                req.flash('authmensage', result.code + ' ' + result.errno);
                return res.redirect('/listaMaestro', '/listaMaestro', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {

        }).fin(function () {
            userService = null;
        });

};

exports.asignarMaterias = function (req, res, next) {
    var service = new UserServices();
    var toSend = {
        MATRICULA: req.params.maestro
    };
    return service.getIdMaestro(toSend)
        .then(function (result) {
            return res.render('./template/asignarMateria', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        });
};

exports.verAsignacion = function (req, res, next) {
    var service = new UserServices();
    var toSend = {
        TURNO: req.body.verAsigTurno,
        CARRERA: req.body.verAsigCarrera,
        SEMESTRE: req.body.verAsigSemestre,
        CICLO: req.body.verAsigCiclo,
        idCarrera: req.user.idCarrera
    };
    return service.verAsignacion(toSend, req.user.role)
        .then(function (result) {
            return res.render('./template/verListaAsignacion', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR YnY');
            return res.redirect('/planAcademico', '/planAcademico', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
            toSend = null;
        });
};
