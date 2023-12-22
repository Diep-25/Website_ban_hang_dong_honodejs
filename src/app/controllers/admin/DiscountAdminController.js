
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
        const message = req.flash('success')[0] || '';
        res.render('discount/discountAdmin', {
            title: 'Mã giảm giá',
            discounts: arrayData,
            users: users,
            message : message
        });
    }

    async save(req, res) {

        discountModel.create({
            code: req.body.code,
            discount: req.body.discount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            id_user: req.body.id_user,
        }).then(() => {
            req.flash('success', 'Thêm mã giảm giá thành công!')
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

    update(req, res) {

        discountModel.update({
            code: req.body.code,
            discount: req.body.discount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            id_user: req.body.id_user,
        },
        {
            where: { id: req.params.id }
        }
        ).then(() => {
            req.flash('success', 'Cập nhật mã giảm giá thành công!')
            res.redirect('/admin/discount');
        }).catch(() => {
            res.redirect('/admin/discount/edit/' + req.params.id);
        });
    }

    delete(req, res) {
        discountModel.destroy({
            where: { id: req.params.id},
        }).then(() => {
            req.flash('success', 'Xóa mã giảm giá thành công!')
            res.redirect('/admin/discount');
        }).catch(() => {
            res.redirect('/admin/discount');
        })
    }

}




module.exports = new DiscountAdminController;