

const { mutipleConvertToObject } = require('../../../util/convert');
const orderModel = require('../../models/OderModel');
const addressModel = require('../../models/AddressModel');
const productModel = require('../../models/ProductModel');
const detailOrderModel = require('../../models/DetailOderModel');
const userModel = require('../../models/UserModel');
const path = require('path');
const bcrypt = require("bcrypt")
const fs = require('fs');
class UserAdminController {

    // get
    async index(req, res) {

        const orderData = await orderModel.findAll({
            include: [
                { model: addressModel },
                { model: userModel },
              ],
            attributes: ['id', 'code', 'payment', 'status', 'id_user', 'id_address', 'createdAt']
        });
        
        const oders = mutipleConvertToObject(orderData);

        const message = req.flash('success')[0] || '';
        res.render('order/allOrder', {
            title: 'Đơn hàng',
            oders: oders,
            message: message
        });
    }

    detail(req, res) {
        detailOrderModel.findAll({
            include: [
                { model: orderModel },
                { model: productModel },
              ],
            attributes: ['id', 'id_order', 'quantity', 'id_product'],
            where: {
                id_order: req.params.id
            }
        }).then((detail) => res.json(detail))
    }
    approve (req, res) {
        orderModel.update({
            status: "Đã phê duyệt"
        }, {
            where: { id: req.params.id }
        }).then(() => {
            req.flash('success', 'Đơn hàng đã duyệt thành công!')
            res.redirect('/admin/order');
        })
    }
}




module.exports = new UserAdminController;