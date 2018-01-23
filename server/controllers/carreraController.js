var messageError = require('../services/error');
var CarreraServices = require('../services/carreraServices');

exports.getCarrera = function (req, res, next) {
    var carrera = new CarreraServices();
    return carrera.getCarreras().then(function (result) {
        carrera = null;
        return res.render('./template/agregarCarrera', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('info'),
            er: req.flash('authmessage'),
            data: result
        });
    });

};

exports.registrarCarrera = function (req, res, next) {
    var carrera = new CarreraServices();
    var CARRERA = {
        NOMBRE: req.body.inputNombreCarrera,
        EDITOR: req.user.usuario,
        CICLOACTUAL: req.body.intpuCicloCarrera
    };
    return carrera.registrarCarrera(CARRERA).then(function (result) {
        console.log(result);
        carrera = null;
        CARRERA = null;
        if (result === true) {
            req.flash('info', 'Registro Exitoso.');
            return res.redirect('/registrarCarrera', '/registrarCarrera', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        } else {
            if (result.code === 'ER_DUP_ENTRY') {
                req.flash('authmessage', 'ERROR: Esa carrera ya existe en el sistema.');
                return res.redirect('/registrarCarrera', '/registrarCarrera', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        }
    });
};

exports.postEditarCarrera = function (req, res, next) {
    var carrera = new CarreraServices();
    var toSend = {
        ID: req.body.carreraID,
        NOMBRE: req.body.inputNombreCarrera,
        CICLOACTUAL: req.body.intpuCicloCarrera,
        EDITOR: req.user.usuario
    };
    return carrera.actualizar(toSend).then(function (result) {
        if (result === true) {
            req.flash('info', 'Se ha actualizado la información correctamente.');
            return res.redirect('/editarCarrera/' + toSend.ID, '/editarCarrera/' + toSend.ID, {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        } else {
            if (result.code === 'ER_DUP_ENTRY') {
                req.flash('authmessage', 'ERROR: Esa carrera ya existe en el sistema.');
            } else {
                req.flash('authmessage', 'ERROR: en el sistema.');
            }
            return res.redirect('/editarCarrera/' + toSend.ID, '/editarCarrera/' + toSend.ID, {
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }

    }).fail(function (error) {
        req.flash('authmessge', 'ERROR en el sistema, intenta nuevamente.');
        return res.redirect('/editarCarrera/' + toSend.ID, '/editarCarrera/' + toSend.ID, {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });
};

exports.editarCarrera = function (req, res, next) {
    var carrera = new CarreraServices();
    var toSend = {
        CARRERA_ID: req.params.id
    };
    return carrera.getCarreraById(toSend).then(function (result) {
        carrera = null;
        return res.render('./template/editarCarrera', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('info'),
            er: req.flash('authmessage'),
            data: result
        });
    }).fail(function (error) {
        throw error;
    });
};

exports.eliminarCarrera = function (req, res, next) {
    var carrera = new CarreraServices();
    var params = {
        _ID: parseInt(req.body.id),
        _EDITOR: req.user.usuario
    };
    carrera.ajaxEliminar(params).then(function (result) {
        carrera = null;
        params = null;
        res.json(result);
    });
};

exports.activarCarrera = function (req, res, next) {
    var carrera = new CarreraServices();
    var params = {
        _ID: parseInt(req.body.id),
        _EDITOR: req.user.usuario,
        _VALIDO: 'Y'
    };
    carrera.ajaxActivar(params).then(function (result) {
        carrera = null;
        params = null;
        res.json(result);
    });
};
