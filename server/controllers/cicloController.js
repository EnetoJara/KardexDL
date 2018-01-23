var CicloService = require('../services/cicloServices');
var moment = require('moment');


exports.getCiclo = function (req, res, next) {
    var Ciclo = new CicloService();

    return Ciclo.getCiclos()
        .then(function (result) {
            Ciclo = null;
            return res.render('./template/agregarCiclo', {
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                message: req.flash('info'),
                er: req.flash('authmessage'),
                ciclos: result
            });
        });
};

exports.registrarCiclo = function (req, res, next) {

    var Ciclo = new CicloService();
    var CICLO = {
        CODIGO: req.body.inputIdCiclo,
        FECHAINI: moment(new Date(req.body.inputFechaIni), ['MM-DD-YYYY', 'YYYY-MM-DD']),
        FECHAFINI: moment(new Date(req.body.inputFechaFini), ['MM-DD-YYYY', 'YYYY-MM-DD']),
        EDITOR: req.user.usuario
    };

    if (CICLO.FECHAINI.isBefore(CICLO.FECHAFINI)) {
        CICLO.FECHAFINI = CICLO.FECHAFINI.format('YYYY-MM-DD');
        CICLO.FECHAINI = CICLO.FECHAINI.format('YYYY-MM-DD');
       return Ciclo.registarCiclo(CICLO)
            .then(function (result) {
                if (result === true) {
                    req.flash('info', 'Se a registrado el CICLO con exito.');
                    return res.redirect('/registrarCiclo', '/registrarCiclo', {
                        isAuthenticated: req.isAuthenticated(),
                        user: req.user
                    });
                } else {
                    req.flash('authmessage', result.code + ' ' + result.errno);
                    return res.redirect('/registrarCiclo', '/registrarCiclo', {
                        isAuthenticated: req.isAuthenticated(),
                        user: req.user
                    });
                }
            });
    } else {
        req.flash('authmessage', 'ERROR: La Fecha inicial NO puede ser despues de la fecha FINAL.');
        return res.redirect('/registrarCiclo', '/registrarCiclo', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    }
};

exports.activarCiclo = function (req, res, next) {
    var ciclo = new CicloService();
    var params = {
        _ID: parseInt(req.body.id),
        _EDITOR: req.user.usuario,
        _VALIDO: 'Y'
    };
   return ciclo.ajaxActivar(params)
        .then(function (result) {
            ciclo = null;
            params = null;
            res.json(result);
        });
};

exports.eliminarCiclo = function (req, res, next) {
    var ciclo = new CicloService();
    var params = {
        _ID: parseInt(req.body.id),
        _EDITOR: req.user.usuario
    };
    return ciclo.ajaxEliminar(params)
        .then(function (result) {
            ciclo = null;
            params = null;
            res.json(result);
        });
};
