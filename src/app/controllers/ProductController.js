
const productModel = require('../models/ProductModel');
const { mutipleConvertToObject } = require('../../util/convert');
const { getOder } = require('../../util/oders');

class ProductController {

    // index
    async index(req, res) {
        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status']
        })
        const products = mutipleConvertToObject(productData);
        const fullUrl = req.protocol + '://' + req.get('host');
        // oder
        const oders = getOder(req);
        var count_cart = 0;
        if (oders) {
            oders.forEach(oder => {
                var count = oder.quantity * oder.price;
                count_cart += count;
            });
        }

        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }

        res.render('product/index', {
            title: 'Tất cả sản phẩm',
            hostName: fullUrl,
            products: products,
            oders: oders,
            count_cart: count_cart,
            user: checkLogin
        });
    }

    async detail(req, res) {

        const fullUrl = req.protocol + '://' + req.get('host');
        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status']
        })
        const products = mutipleConvertToObject(productData);

        const productsDetail = await productModel.findOne({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status'],
            where: { id: req.params.id }
        });

        const oders = getOder(req);
        var count_cart = 0;
        if (oders) {
            oders.forEach(oder => {
                var count = oder.quantity * oder.price;
                count_cart += count;
            });
        }

        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }
        const alertMessage = req.flash('addCart')[0] || '';
        res.render('product/detail', {
            title: productsDetail.dataValues.name,
            hostName: fullUrl,
            product: productsDetail.dataValues,
            products: products,
            oders: oders,
            count_cart: count_cart,
            user: checkLogin,
            message: alertMessage
        });
    }

    async modal(req, res) {
        productModel.findOne({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status'],
            where: { id: req.params.id }
        })
            .then(product => res.json(product))
            .catch(err => next(err))
    }
    addCart(req, res) {

        productModel.findOne({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status'],
            where: { id: req.params.id }
        })
            .then(product => {
                var productOder = product.dataValues;
                productOder.quantity = parseInt(req.body.quantity);
                var options = {
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true
                }

                if (req.cookies.oders) {
                    const oders = req.cookies.oders;
                    let productExists = false;

                    for (let index = 0; index < oders.length; index++) {
                        if (oders[index].id == productOder.id) {
                            oders[index].quantity += productOder.quantity;
                            productExists = true;
                            break;
                        }
                    }

                    if (!productExists) {
                        oders.push(productOder);
                    }

                    res.cookie('oders', oders, options);
                } else {
                    const arrayOder = [productOder];
                    res.cookie('oders', arrayOder, options);
                }
                req.flash('addCart', 'Thêm đơn hàng thành công!')
                res.redirect('/product/detail/' + product.id);
            })
            .catch(() => {

            })
    }
}

module.exports = new ProductController;