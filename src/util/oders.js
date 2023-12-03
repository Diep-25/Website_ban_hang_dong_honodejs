
module.exports = {
    getOder : function(req) {
        var arrayOders = [];
        if (req.cookies.oders) {
            arrayOders = req.cookies.oders;
        }
        return arrayOders;
    }
}
