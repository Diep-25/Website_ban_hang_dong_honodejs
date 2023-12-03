
class SiteAdminController {

    // get
    index(rep, res, next) {
        res.render('homeAdmin');
    }

}




module.exports = new SiteAdminController;