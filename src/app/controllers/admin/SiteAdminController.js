
class SiteAdminController {

    // get
    index(rep, res, next) {
        res.render('homeAdmin', {
            title: "Trang chủ"
        });
    }

}




module.exports = new SiteAdminController;