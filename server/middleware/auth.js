module.exports = {
    isLogged: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash('authmessage', 'ERROR: Favor de iniciar Sesion primero!');
            return res.redirect('/login');
        }
    },
    isAdmin: function (req, res, next) {
        if (req.user.role === 'ADMIN') {
            next();
        } else {
            return res.redirect('/404', '/404', {});
        }
    },
    isAuth: function (req, res, next) {
        if (req.user.role === 'ADMIN' || req.user.role === 'CONTROLESCOLAR') {
            next();
        } else {
            return res.redirect('/404', '/404', {});
        }
    },
    isControl: function (req, res, next) {
        if (req.user.role === 'CONTROLESCOLAR') {
            next();
        } else {
            return res.redirect('/404', '/404', {});
        }
    },
    isMaestro: function (req, res, next) {
        if (req.user.role === 'MAESTRO') {
            next();
        } else {
            return res.redirect('/404', '/404', {});
        }
    },
    isAlumno: function (req, res, next) {
        if (req.user.role === 'ALUMNO') {
            next();
        } else {
            return res.redirect('/404', '/404', {});
        }
    }

};
