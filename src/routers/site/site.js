const express = require('express');
const router = express.Router();

const siteController = require('../../app/controllers/siteController');

router.post('/register', siteController.register);

router.get('/signin', siteController.signin);

router.get('/login', siteController.login);

router.post('/login', siteController.checkLogin);

router.get('/logout', siteController.logout);

router.get('/cart', siteController.cart);

router.get('/checkout', siteController.checkout);

router.get('/confirmation', siteController.confirmation);

router.post('/updateAddress/:idUser', siteController.updateAddress);

router.post('/check-confirm/:id', siteController.checkConfirm);

router.get('/order', siteController.order);

router.get('/delete-cart/:id', siteController.deleteCart);

router.get('/contact', siteController.contact);

router.get('/search', siteController.search);

router.get('/address', siteController.address);

router.get('/profile-details', siteController.profileDetails);

router.get('/change-cart/:id/:quantity', siteController.changeCart);

router.get('/', siteController.index);

module.exports = router;
