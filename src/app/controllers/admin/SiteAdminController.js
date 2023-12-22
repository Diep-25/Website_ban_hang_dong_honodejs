
const productModel = require('../../models/ProductModel');
const orderModel = require('../../models/OderModel');
const discountModel = require('../../models/DiscountModel');
const userModel = require('../../models/UserModel');

class SiteAdminController {

    // get
    async index(rep, res, next) {
        const countProduct = await productModel.count();
        const countOder = await orderModel.count();
        const countDiscount = await discountModel.count();
        const countUser = await userModel.count();
        console.log(countProduct);
        res.render('homeAdmin', {
            title: "Trang chủ",
            countProduct: countProduct,
            countOder: countOder,
            countDiscount: countDiscount,
            countUser: countUser
        });
    }

}




module.exports = new SiteAdminController;