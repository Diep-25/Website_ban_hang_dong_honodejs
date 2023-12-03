const isLoggedIn = (req, res, next) => {
    if (req.cookies.login) {
        var checkLogin = req.cookies.login;
        if(req.url.includes('admin/')) {
            if(checkLogin.id_role == 1){
                return next();
            } else {
                res.redirect('/'); 
            }
        }
         
    } else {
        if(req.url.includes('admin/') || req.url.includes('checkout')) {
            res.redirect('/'); 
        }
    }
    return next();
};

module.exports = isLoggedIn;
