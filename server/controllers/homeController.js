exports.index = function (req, res, next) {
    return res.render('./template/login', {
        message: req.flash('info'),
        er: req.flash('authmessage')
    });
};

exports.home = function (req, res, next) {
    return res.render('./template/home', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
};

exports.logOut = function (req, res, next) {
    req.logout();
    res.redirect('/login');
};
