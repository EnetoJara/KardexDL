var messageError = require('../services/error');
var MaterialServices = require('../services/materiaServices');

exports.getMateria = function (req, res, next) {
    var materia = new MaterialServices();
    return materia.getDefaults(req.user.carrera)
        .then(function (result) {
            materia = null;
            return res.render('./template/agregarMateria', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                semestres: result.SEMESTRES,
                materias: result.MATERIAS
            });
        });
};

exports.registrarMateria = function (req, res, next) {
    var materia = new MaterialServices();

    var SUBJECT = {
        NOMBRE: req.body.inputMateriaNombreForm,
        SEMESTRE_ID: req.body.selectMateriaSemestre,
        CARRERA_ID: req.user.carrera,
        EDITOR: req.user.usuario
    };

    return materia.registrarMateria(SUBJECT)
        .then(function (result) {
            if (result === true) {
                req.flash('info', 'Se a registrado CORRECTAMENTE.');
                return res.redirect('/registrarMateria', '/registrarMateria', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                req.flash('authmessage', 'ERROR: NO es posible registrar la misma materia dos veces.');
                return res.redirect('/registrarMateria', '/registrarMateria', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor de contactar al Administrador.');
            return res.redirect('/registrarMateria', '/registrarMateria', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        });
};

exports.eliminarMateria = function (req, res, next) {
    var materia = new MaterialServices();
    var parametros = {
        ID: req.body.id,
        EDITOR: req.user.usuario
    };
    return materia.eliminarMateria(parametros).then(function (result) {
        materia = null;
        res.json(result);
    }).fail(function (error) {
        materia = null;
        res.json(error);
    });
};

exports.activarMateria = function (req, res, next) {
    var materia = new MaterialServices();
    var parametros = {
        ID: req.body.id,
        EDITOR: req.user.usuario
    };
    return materia.activarMateria(parametros).then(function (result) {
        materia = null;
        res.json(result);
    }).fail(function (error) {
        materia = null;
        res.json(error);
    });
};

exports.editarMateria = function (req, res, next) {
    var materia = new MaterialServices();
    var params = {
        ID: req.params.id,
        CARRERA: req.user.carrera
    };
    return materia.getMateriaById(params).then(function (result) {
        materia = null;
        return res.render('./template/editarMateria', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('info'),
            er: req.flash('authmessage'),
            data: result
        });
    }).fail(function (error) {
        req.flash('authmessage', error);
        return res.redirect('/login');
    });
};

exports.postEditarMateria = function (req, res, next) {
    var materia = new MaterialServices();
    var params = {
        ID: req.body.editMateId,
        NOMBRE: req.body.inputMateriaNombreForm,
        SEMESTRE: req.body.selectMateriaSemestre,
        CARRERA: req.user.carrera,
        EDITOR: req.user.usuario
    };
    return materia.postEditar(params).then(function (result) {
        req.flash('info', 'Se ha actualizado correctemente.');
        return res.redirect('/editarMateria/' + params.ID, '/editarMateria/' + params.ID, {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    }).fail(function (error) {
        req.flash('authmessage', 'ERROR en el sistema, intenta nuevamente.');
        return res.redirect('/editarMateria/' + params.ID, '/editarMateria/' + params.ID, {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });
};

exports.getMateriasBySemestre = function (req, res, next) {
    var service = new MaterialServices();
    var toSend = {
        SEMESTRE: req.body.ID,
        CARRERA: req.user.idCarrera,
        TURNO: req.body.TURNO
    };
    return service.getMateriasBySemestre(toSend)
        .then(function (result) {
            res.json(result);
        }).fail(function (error) {
            res.json(error);
        }).fin(function () {
            service = null;
        });
};

exports.postAsignar = function (req, res, next) {
    var toSend = {
        TURNO: req.body.asignarTurno,
        CARRERA: req.user.idCarrera,
        MATERIAS: req.body.asignarMaterias,
        MAESTRO: req.body.M_ID
    };
    var service = new MaterialServices();

    return service.asignarMaterias(toSend)
        .then(function (result) {
            req.flash('info', 'Se han asignado correctamente.');
            return res.redirect('/listaMaestro', '/listaMaestro', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor de Conctactar al Administrador.');
            return res.redirect('/listaMaestro', '/listaMaestro', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            toSend = null;
            service = null;
        });
};

exports.designarMarteria = function (req, res, next) {
    var service = new MaterialServices();

    return service.designarMarteria(req.body.id)
        .then(function (result) {
            res.json(result);
        }).fail(function (error) {
            res.json(error);
        }).fin(function () {
            service = null;
        });
};

exports.planAcademico = function (req, res, next) {

    var service = new MaterialServices();
    return service.getdefaultAcademico(req.user.idCarrera, req.user.role)
    .then(function (result) {
        return res.render('./template/verListaMaterias', {
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
