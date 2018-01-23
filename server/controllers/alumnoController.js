var AlumnoService = require('../services/alumnoService');

exports.verMisMaterias = function (req, res, next) {
    var service = new AlumnoService();
    return service.verMisMaterias(req.user.idRole)
        .then(function (result) {
            return res.render('./template/misMaterias', {
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

exports.verMisNotas = function (req, res, next) {
    return res.render('./template/misNotas', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        message: req.flash('info'),
        er: req.flash('authmessage'),
        data: null
    });
};

exports.resumenNotas = function (req, res, next) {
    var service = new AlumnoService();
    return service.resumenNotas(req.user.idRole)
        .then(function (result) {
            if (result.DEFAULTS.PUBLICA === 0) {
                req.flash('authmessage', 'Las Calificaciones aún no son publicadas, favor de contactar a control escolar');
                return res.redirect('/verMisCalificaciones', '/verMisCalificaciones', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            } else {
                return res.render('./template/misNotas2', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    message: req.flash('info'),
                    er: req.flash('authmessage'),
                    data: result
                });
            }

        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor de contactar al administrador!');
            return res.redirect('/verMisCalificaciones', '/verMisCalificaciones', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {

        });
};

exports.buscarAlumnoPorNombre = function (req, res, next) {
    return res.render('./template/buscarAlumnoPorNombre', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        message: req.flash('info'),
        er: req.flash('authmessage'),
        data: null
    });
};

exports.postBuscarAlumnoPorNombre = function (req, res, next) {

    var service = new AlumnoService();
    var toSend = {
        MATRICULA: (req.body.maestroNum && req.body.maestroNum.trim().length > 0) ? '%' + req.body.maestroNum.trim() + '%' : null,
        NOMBRE: (req.body.maestroNombre && req.body.maestroNombre.trim().length > 0) ? '%' + req.body.maestroNombre.trim() + '%' : null,
        APELLIDO: (req.body.maestroApellido && req.body.maestroApellido.trim().length > 0) ? '%' + req.body.maestroApellido.trim() + '%' : null,
        idCarrera: req.user.idCarrera
    };
    return service.getPosiblesAlumnos(toSend)
        .then(function (result) {
            return res.render('./template/buscarAlumnoPorNombre2', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor de contactar al administrador!');
            return res.redirect('/buscarAlumno', '/buscarAlumno', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
            toSend = null;
        });
};

exports.resultadoDelSemestre = function (req, res, next) {
    var toSend = {
        SEMESTRE: req.body.histoSemestre,
        ID: req.body.histoAlumno
    };
    var service = new AlumnoService();
    return service.resultadoDelSemestre(toSend)
        .then(function (result) {
            return res.render('./template/historialAlumno2', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                data: result
            });
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: Favor que contactar al administrador.');
            return res.redirect('/buscarAlumno', '/buscarAlumno', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            toSend = null;
            service = null;
        });
};

exports.pdfFromHTMLString = function (req, res, next) {

    var service = new AlumnoService();
    var nombreArchivo = req.user.usuario;
    var toReturn = {},
        config = {
            "border": {
                "top": "2in",
                "right": "1in",
                "bottom": "2in",
                "left": "1.5in"
            },
            "format": 'Letter',
            "orientation": "portrait",
        };

    return service.resumenNotas(req.user.idRole)
        .then(function (result) {
            return service.hacertabla(result.NOTAS, req.user.nombre, req.user.usuario, result.ALUMNO);
        }).then(function (docDefinition) {
            res.pdfFromHTML({
                filename: req.user.usuario + '.pdf',
                htmlContent: docDefinition,
                options: {
                    config
                }
            });
        }).fail(function (error) {
            req.flash('authmessage', 'ERROR: En el sistema, favor de contactar al Administrador :v');
            return res.redirect('/verMisCalificaciones', '/verMisCalificaciones', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }).fin(function () {
            service = null;
            nombreArchivo = null;
            toReturn = null;
        });

}
