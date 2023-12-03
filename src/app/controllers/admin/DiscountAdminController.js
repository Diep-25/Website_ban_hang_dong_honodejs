
const discountModel = require('../../models/DiscountModel');
const userModel = require('../../models/UserModel');
const { mutipleConvertToObject, formatDate } = require('../../../util/convert');

class DiscountAdminController {

    // get
    async index(req, res) {

        const discountData = await discountModel.findAll({
            attributes: ['id', 'code', 'discount', 'startDate', 'endDate', 'id_user', 'status'],
            include: [
                { model: userModel },
              ],
        });

        const userData = await userModel.findAll({
            attributes: ['id', 'email']
        })

        const users = mutipleConvertToObject(userData);
        const discounts = mutipleConvertToObject(discountData);
        var arrayData = [];
        discounts.forEach(data => {
            data.startDate = formatDate(data.startDate);
            data.endDate = formatDate(data.endDate);
            if(data.status == 1) {
                data.status = "Chưa sử dụng";
                data.color = "blue";
            } else {
                data.status = "Đã sử dụng";
                data.color = "red";
            }
            arrayData.push(data);
        });
        res.render('discount/discountAdmin', {
            title: 'Mã giảm giá',
            discounts: arrayData,
            users: users
        });
    }

    async save(req, res) {

        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }
        discountModel.create({
            code: req.body.code,
            discount: req.body.discount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            id_user: checkLogin.id,
        }).then((data) => {
            res.redirect('/admin/discount');
        });
    }
    async edit(req, res) {

        const userData = await userModel.findAll({
            attributes: ['id', 'email']
        })
        const users = mutipleConvertToObject(userData);

        discountModel.findOne({
            attributes: ['id', 'code', 'discount', 'startDate', 'endDate', 'id_user', 'status'],
            include: [
                { model: userModel },
              ],
        }).then((discount) => {
            
            res.render('discount/editDiscountAdmin', {
                title: 'Mã giảm giá',
                discount: discount.dataValues,
                users: users
            });
        });

        
    }

}




module.exports = new DiscountAdminController;