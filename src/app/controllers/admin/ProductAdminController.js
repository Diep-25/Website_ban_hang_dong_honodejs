
const productModel = require('../../models/ProductModel');
const path = require('path');
const fs = require('fs');
const { mutipleConvertToObject } = require('../../../util/convert');
class ProductAdminController {

    // get
    async all(req, res) {
        const fullUrl = req.protocol + '://' + req.get('host');

        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status']
        })
        const products = mutipleConvertToObject(productData);
        res.render('product/allProduct', {
            title: 'Sản phẩm',
            hostName: fullUrl,
            products: products,
        });
    }
    async save(req, res) {

        const { image } = req.files;
        image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'products', image.name));
        const imagePatch = path.join('web', 'images', 'products', image.name);
        // req.bodyd
        productModel.create({
            name: req.body.name,
            image: imagePatch.replaceAll(/\\/g, "/"),
            price: req.body.price,
            detail: req.body.detail,
            quantity: req.body.quantity,
            status: req.body.status,
            id_user: 1,
        }).then((data) => {
            res.redirect('/admin/product/all');
        });
    }
    delete(req, res) {
        productModel.destroy({
            where: { id: req.params.id }
        }).then(() => {
            res.redirect('/admin/product/all');
        });
    }
    async edit(req, res) {
        const fullUrl = req.protocol + '://' + req.get('host');
        productModel.findOne({
            attributes: ['id', 'name', 'image', 'price', 'detail', 'quantity', 'status'],
            where: { id: req.params.id }
        })
            .then(product => {

                res.render('product/editProduct', {
                    title: product.name,
                    hostName: fullUrl,
                    product: product.dataValues,
                });
            })
            .catch(err => {
                console.log(err);
            })
    }
    async update(req, res) {
        var data = {
            name: req.body.name,
            price: req.body.price,
            detail: req.body.detail,
            quantity: req.body.quantity,
            status: req.body.status,
            id_user: 1,
        }

        const product = await productModel.findOne({
            attributes: ['id', 'image'],
            where: { id: req.params.id }
        })
        
        var imagePatch = '';
        if (req.files) {
            var filePath = path.join(__dirname, '../../../', 'public', product.dataValues.image);
            const existsFile = fs.existsSync(filePath)
            if (existsFile) {
                fs.unlinkSync(filePath);
            }
            const { image } = req.files;
            image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'products', image.name));
            imagePatch = path.join('web', 'images', 'products', image.name);
            data.image = imagePatch.replaceAll(/\\/g, "/");
        }
        productModel.update(data, {
            where: { id: req.params.id }
        }).then(() => {
            res.redirect('/admin/product/all');
        })
    }

}




module.exports = new ProductAdminController;