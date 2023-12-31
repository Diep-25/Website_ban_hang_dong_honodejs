const express = require('express');
const router = express.Router();
const siteAdminController = require('../../../app/controllers/admin/SiteAdminController');
const productAdminController = require('../../../app/controllers/admin/ProductAdminController');
const siderAdminController = require('../../../app/controllers/admin/SliderAdminController');
const userAdminController = require('../../../app/controllers/admin/UserAdminController');
const oderAdminController = require('../../../app/controllers/admin/OderAdminController');
const discountAdminController = require('../../../app/controllers/admin/DiscountAdminController');

router.get('/', siteAdminController.index);

router.get('/product/all', productAdminController.all);
router.post('/product/create', productAdminController.save);
router.get('/product/delete/:id', productAdminController.delete);
router.get('/product/edit/:id', productAdminController.edit);
router.post('/product/update/:id', productAdminController.update);

router.get('/slider', siderAdminController.index);
router.get('/slider/update/:id', siderAdminController.edit);
router.get('/slider/delete/:id', siderAdminController.delete);
router.post('/slider/edit/:id', siderAdminController.update);
router.post('/slider/:status', siderAdminController.save);

router.get('/user', userAdminController.index);
router.post('/user/create', userAdminController.save);
// router.get('/product/delete/:id', productAdminController.delete);
router.get('/user/edit/:id', userAdminController.edit);
router.post('/user/update/:id', userAdminController.update);

router.get('/order', oderAdminController.index);
router.get('/order/detail/:id', oderAdminController.detail);
router.get('/order/approve/:id', oderAdminController.approve);

router.get('/discount', discountAdminController.index);
router.post('/discount/create', discountAdminController.save);
router.get('/discount/edit/:id', discountAdminController.edit);
router.post('/discount/update/:id', discountAdminController.update);
router.get('/discount/delete/:id', discountAdminController.delete);

module.exports = router;