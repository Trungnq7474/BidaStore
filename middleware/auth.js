const checkLogin = (req, res, next) => {

    if(!req.session.user) {
        return res.redirect('/login.html');
    }

    next();
};

const checkAdmin = (req, res, next) => {
    if(!req.session.user) {
        return res.redirect('/login.html');
    }

    if(req.session.user.role !== 'admin') {
        return res.redirect('/index.html');
    }

    next();
};

module.exports = { checkAdmin, checkLogin };