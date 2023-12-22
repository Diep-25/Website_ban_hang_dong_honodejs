
const productModel = require('../models/ProductModel');
const { Op, literal } = require('sequelize');
const productImageModel = require('../models/ProductImageModel');
const discountModel = require('../models/DiscountModel');
const { mutipleConvertToObject } = require('../../util/convert');
const { getOder } = require('../../util/oders');

class ProductController {

    // index
    async index(req, res) {
        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'price', 'detail', 'quantity', 'status'],
            include: [
                { model: productImageModel,
                    as: 'images'
                },
            ],
            
        })
        const products = mutipleConvertToObject(productData);
        const fullUrl = req.protocol + '://' + req.get('host');
        // oder
        const oders = getOder(req);
        var count_cart = 0;
        var orderNew = [];
        if (oders) {
            oders.forEach(oder => {
                var count = oder.quantity * oder.price;
                count_cart += count;
                productImageModel.findOne({
                    attributes: ['id', 'url', 'name'],
                    where: { 
                    id_product: oder.id
                    }
                }).then((image) => {
                    oder.url = image.url;
                    orderNew.push(oder);
                })
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
            oders: orderNew,
            count_cart: count_cart,
            user: checkLogin
        });
    }

    async detail(req, res) {

        const fullUrl = req.protocol + '://' + req.get('host');
        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'price', 'detail', 'quantity', 'status'],
            include: [
                { model: productImageModel,
                    as: 'images'
                },
            ],
            where: { 
                id: {
                  [Op.ne]: req.params.id
                }
            },
            limit: 4
        })
        const products = mutipleConvertToObject(productData);
        
        const productsDetail = await productModel.findOne({
            attributes: ['id', 'name', 'price', 'detail', 'quantity', 'status'],
            where: { id: req.params.id },
            include: [
                { model: productImageModel,
                    as: 'images'
                },
            ],
            
        });
        const oders = getOder(req);
        var count_cart = 0;
        var orderNew = [];
        if (oders) {
            oders.forEach(oder => {
                var count = oder.quantity * oder.price;
                count_cart += count;
                productImageModel.findOne({
                    attributes: ['id', 'url', 'name'],
                    where: { 
                    id_product: oder.id
                    }
                }).then((image) => {
                    oder.url = image.url;
                    orderNew.push(oder);
                })
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
            images: productsDetail.images,
            oders: orderNew,
            count_cart: count_cart,
            user: checkLogin,
            message: alertMessage
        });
    }

    async modal(req, res) {
        productModel.findOne({
            attributes: ['id', 'name', 'price', 'detail', 'quantity', 'status'],
            where: { id: req.params.id },
            include: [
                { model: productImageModel,
                    as: 'images'
                },
            ],
        })
            .then(product => res.json(product))
            .catch(err => next(err))
    }
    addCart(req, res) {

        productModel.findOne({
            attributes: ['id', 'name', 'price', 'quantity', 'status'],
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
    addDiscount(req, res) {
        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }
        const currentDate = new Date().toISOString().split('T')[0];

        var options = {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        }
        discountModel.findOne({
            attributes: ['code', 'discount', 'status', 'startDate', 'endDate'],
            where: { 
                code: req.query.code,
                status: 1,
                startDate: {
                    [Op.lte]: literal(`'${currentDate}'`),
                },
                endDate: {
                    [Op.gte]: literal(`'${currentDate}'`),
                },
            }
        }).then((data) => {
            if (data) {
                var oders = {
                    user: checkLogin.id,
                    code: data.code,
                    discount: data.discount
                }
                res.cookie('discount', oders, options);
                req.flash('success', 'Áp dụng mã giả giá thành công!')
                res.redirect('/checkout');
            } else {
                res.redirect('/checkout');
            }
        })

    }
}

module.exports = new ProductController;