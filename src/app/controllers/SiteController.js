const userModel = require('../models/UserModel');
const sliderModel = require('../models/SliderModel');
const productModel = require('../models/ProductModel');
const addressModel = require('../models/AddressModel');
const oderModel = require('../models/OderModel');
const discountModel = require('../models/DiscountModel');
const productImageModel = require('../models/ProductImageModel');
const roleModel = require('../models/RoleModel');
const { Op } = require('sequelize');
const detailOderModel = require('../models/DetailOderModel');
const bcrypt = require("bcrypt")
const { mutipleConvertToObject, formatDate } = require('../../util/convert');
const mail = require('../../util/sendMail');
const { getOder } = require('../../util/oders');
const fs = require('fs');
const path = require('path');

class SiteController {

    // get
    async index(req, res, next) {


        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'price', 'detail', 'quantity', 'status'],
            where: { 
              status: {
                [Op.ne]: 0
              }
            },
            order: [
              ['id', 'DESC']
            ],
            include: [
              { model: productImageModel,
                  as: 'images'
              },
            ],
            limit: 8
        })
        const products = mutipleConvertToObject(productData);
        const sliderData = await sliderModel.findAll({
            attributes: ['name', 'content', 'url', 'image', 'attribute']
        });

        const fullUrl = req.protocol + '://' + req.get('host');

        const sliders = mutipleConvertToObject(sliderData);

        for (let index = 0; index < sliders.length; index++) {
            sliders[index].image = sliders[index].image.replaceAll(/\\/g, "/");
            if (sliders[index].attribute == 1) {
                sliders[index].attribute = 'text-left';
            }
            if (sliders[index].attribute == 2) {
                sliders[index].attribute = 'text-center';
            }
            if (sliders[index].attribute == 3) {
                sliders[index].attribute = 'text-right';
            }
        }

        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }

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

        res.render('home', {
            title: 'Trang chủ',
            hostName: fullUrl,
            sliders: sliders,
            products: products,
            user: checkLogin,
            oders: orderNew,
            count_cart: count_cart
        })
    }

    // login
    login(req, res) {
        res.render('login/index', {
            title: "Đăng nhập"
        });
    }

    logout(req, res) {
      res.clearCookie('login');
      res.redirect('/');
    }

    async checkLogin(req, res) {
        const userEmail = await userModel.findOne({
            attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'id_role', 'code'],
            where: { email: req.body.email }
        });

        if (userEmail != null) {
          if (userEmail.dataValues.code != null) {
            res.render('confirmUser/index', {
              title: 'Xác thực',
              idUser: userEmail.dataValues.id
            })
          }
            bcrypt.compare(req.body.password, userEmail.password, (err, data) => {

                if (err) res.redirect('/login');
                if (data) {
                    // tồn tại 60p
                    let options = {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true
                    }
                    delete userEmail.password;
                    // Set cookie
                    res.cookie('login', userEmail, options)
                    res.redirect('/');
                }

            })
        } else {
            res.redirect('/login');
        }

    }

    // signin
    signin(req, res) {
        res.render('signin/index', {
            title: "Đăng ký"
        });
    }


    async register(req, res) {

        const userEmail = await userModel.findOne({ where: { email: req.body.email } });
        if (userEmail != null) {
            res.redirect('/signin');
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.redirect('/signin');
                }
                var randomCode = Math.floor(100000 + Math.random() * 900000);
                userModel.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                    code: randomCode
                }).then((user) => {
                    mail.sendMail({
                      from: '"DAU Shop" ngod00586@gmail.com',
                      to: req.body.email,
                      subject: "Mã xác nhận tài khoản DAU Shop",
                      html: `<!DOCTYPE html>
                      <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Xác nhận đơn hàng</title>
                          </head>
                          <body style="
                          box-sizing: border-box;
                          margin: 0;
                      ">
                              <div class="main">
                                  <div class="header" style="
                          border-bottom: 2px solid black;
                      ">
                                      <h1 style="
                          text-align: center;
                      ">DAU SHOP</h1>
                                  </div>
                                  <div class style="
                          width: 700px;
                          margin: auto;
                          text-align: center;
                      ">
                                      <p>Mã xác nhận tài khoản <span style="
                          color: red;
                      ">${req.body.email}</span></p>
                                      <h3>${randomCode}</h3>
                                  </div>
                              </div>
                          </body>
                      </html>`,
                    }).then(() => {
                      res.render('confirmUser/index', {
                        title: 'Xác thực',
                        idUser: user.id
                      })
                    });
                });
            })
        }
    }

    checkConfirm(req, res) {
      const inputCode =  req.body.code;
      if(req.params.id) {
        userModel.findOne({ 
          where: { id: req.params.id } 
        }).then((user) => {
          if (user.code != inputCode) {
            res.render('confirmUser/index', {
              title: 'Xác thực',
            })
          }
          userModel.update(
            { 
              code: null,
              status: 1
            }, {
              where: {
                id: user.id
              }
          }).then(() => {
            res.redirect('/login');
          });
          
        });
      }

    }

    cart(req, res) {
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

        res.render('cart/index', {
            title: 'Giỏ hàng',
            oders: orderNew,
            user: checkLogin,
            count_cart: count_cart
        });
    }

    changeCart(req, res) {
        var oders = getOder(req);
        const idProduct = req.params.id;
        const quantity = req.params.quantity;
        if (oders) {
            var options = {
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            }
            for (let index = 0; index < oders.length; index++) {
                if (parseInt(oders[index].id) == parseInt(idProduct)) {
                    oders[index].quantity = parseInt(quantity);
                }
            }
            res.cookie('oders', oders, options)
            res.json(true)
        }
    }

    async checkout(req, res) {

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
        var address = {};
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
            address = await addressModel.findOne({
                attributes: ['id', 'address', 'phone', 'name', 'city', 'zip_code'],
                where: { id_user: checkLogin.id }
            })
            if (address) {
              address = address.dataValues;
            }
        }
        var discount = 0;
        if (req.cookies.discount) {
          var discounts = req.cookies.discount;
          if (checkLogin.id == discounts.user) {
            discount = discounts.discount;
          }
        }

        res.render('checkout/index', {
            title: 'Thanh toán',
            oders: orderNew,
            count_cart: count_cart,
            address: address,
            discount: discount,
            idUser: checkLogin.id
        });
    }

    async confirmation(req, res) {

        var user = req.cookies.login;
        var address = await addressModel.findOne({
            attributes: ['id'],
            where: { id_user: user.id }
        })
        var idAddress = address.dataValues.id;


        var codeOder = Math.floor(100000 + Math.random() * 900000);

        const createOder = await oderModel.create({
            payment: req.query.payment,
            code: codeOder,
            status: "Chờ phê duyệt",
            id_user: user.id,
            id_address: idAddress
        });
        const oders = getOder(req);
        var ArrayOder = [];
        oders.forEach(oder => {
            var paymentObject = {
                quantity: oder.quantity,
                id_product: oder.id,
                id_order: createOder.id
            };
            ArrayOder.push(paymentObject);
        });
        detailOderModel.bulkCreate(ArrayOder);
        let currentDate = new Date().toJSON().slice(0, 10);

        let contentHtml = '';

        let countSubtotal = 0;
        for (const item of oders) {
            var price = (item.price) * (item.quantity);
            countSubtotal += price;
            price = price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});

            contentHtml += `<div style="background-color: transparent">
            <div class="block-grid three-up no-stack" style="
          min-width: 320px;
          max-width: 680px;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          margin: 0 auto;
          background-color: transparent;
          ">
              <div style="
          border-collapse: collapse;
          display: table;
          width: 100%;
          background-color: transparent;
          ">
                <div class="col num4" style="
          display: table-cell;
          vertical-align: top;
          max-width: 320px;
          min-width: 224px;
          width: 226px;
          ">
                  <div class="col_cont"
                    style="width: 100% !important">
                    <div style="
          border-top: 0px solid transparent;
          border-left: 0px solid transparent;
          border-bottom: 0px solid transparent;
          border-right: 0px solid transparent;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-right: 5px;
          padding-left: 5px;
          ">
                      <div style="
            color: #393d47;
            font-family: Nunito, Arial, Helvetica Neue,
              Helvetica, sans-serif;
            line-height: 1.2;
            padding-top: 10px;
            padding-right: 0px;
            padding-bottom: 10px;
            padding-left: 10px;
          ">
                        <div
                          class="txtTinyMce-wrapper"
                          style="
              line-height: 1.2;
              font-size: 12px;
              color: #393d47;
              font-family: Nunito, Arial, Helvetica Neue,
                Helvetica, sans-serif;
              mso-line-height-alt: 14px;
            ">
                          <p style="
                font-size: 14px;
                line-height: 1.2;
                word-break: break-word;
                mso-line-height-alt: 17px;
                margin: 0;
              ">
                            ${item.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col num4" style="
          display: table-cell;
          vertical-align: top;
          max-width: 320px;
          min-width: 224px;
          width: 226px;
          ">
                  <div class="col_cont"
                    style="width: 100% !important">
                    <div style="
          border-top: 0px solid transparent;
          border-left: 0px solid transparent;
          border-bottom: 0px solid transparent;
          border-right: 0px solid transparent;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-right: 5px;
          padding-left: 5px;
          ">
                      <div style="
            color: #393d47;
            font-family: Nunito, Arial, Helvetica Neue,
              Helvetica, sans-serif;
            line-height: 1.2;
            padding-top: 10px;
            padding-right: 5px;
            padding-bottom: 10px;
            padding-left: 5px;
          ">
                        <div
                          class="txtTinyMce-wrapper"
                          style="
              line-height: 1.2;
              font-size: 12px;
              color: #393d47;
              font-family: Nunito, Arial, Helvetica Neue,
                Helvetica, sans-serif;
              mso-line-height-alt: 14px;
            ">
                          <p style="
                font-size: 14px;
                line-height: 1.2;
                word-break: break-word;
                text-align: center;
                mso-line-height-alt: 17px;
                margin: 0;
              ">
                            ${item.quantity}
                            
                          </p>
                        </div>
                      </div>
          
                    </div>
          
                  </div>
                </div>
          
                <div class="col num4" style="
          display: table-cell;
          vertical-align: top;
          max-width: 320px;
          min-width: 224px;
          width: 226px;
          ">
                  <div class="col_cont"
                    style="width: 100% !important">
                    <div style="
          border-top: 0px solid transparent;
          border-left: 0px solid transparent;
          border-bottom: 0px solid transparent;
          border-right: 0px solid transparent;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-right: 5px;
          padding-left: 5px;
          ">
                      <div style="
            color: #393d47;
            font-family: Nunito, Arial, Helvetica Neue,
              Helvetica, sans-serif;
            line-height: 1.2;
            padding-top: 10px;
            padding-right: 10px;
            padding-bottom: 10px;
            padding-left: 0px;
          ">
                        <div
                          class="txtTinyMce-wrapper"
                          style="
              line-height: 1.2;
              font-size: 12px;
              color: #393d47;
              font-family: Nunito, Arial, Helvetica Neue,
                Helvetica, sans-serif;
              mso-line-height-alt: 14px;
            ">
                          <p style="
                font-size: 14px;
                line-height: 1.2;
                word-break: break-word;
                text-align: right;
                mso-line-height-alt: 17px;
                margin: 0;
              ">
                            ${price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
        }
        countSubtotal = countSubtotal.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        mail.sendMail({
            from: '"DAU Shop" ngod00586@gmail.com',
            to: user.email,
            subject: "Đặt hàng DAU Shop",
            html: `<!DOCTYPE html>
            <html lang="en">
            
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Đặt hàng thành công</title>
                </head>
            
                <body class="clean-body" style="
                  margin: 0;
                  padding: 0;
                  -webkit-text-size-adjust: 100%;
                  background-color: #f2fafc;
                ">
            
                    <table bgcolor="#f2fafc" cellpadding="0" cellspacing="0"
                        class="nl-container" role="presentation" style="
                    table-layout: fixed;
                    vertical-align: top;
                    min-width: 320px;
                    border-spacing: 0;
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    background-color: #f2fafc;
                    width: 100%;
                  " valign="top" width="100%">
                        <tbody>
                            <tr style="vertical-align: top" valign="top">
                                <td style="word-break: break-word; vertical-align: top"
                                    valign="top">
            
                                    <div style="background-color: #fb3c2d">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
            
                                                <div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <table border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                class="divider"
                                                                role="presentation" style="
                                        table-layout: fixed;
                                        vertical-align: top;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        min-width: 100%;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      " valign="top" width="100%">
                                                                <tbody>
                                                                    <tr
                                                                        style="vertical-align: top"
                                                                        valign="top">
                                                                        <td
                                                                            class="divider_inner"
                                                                            style="
                                              word-break: break-word;
                                              vertical-align: top;
                                              min-width: 100%;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                              padding-top: 0px;
                                              padding-right: 0px;
                                              padding-bottom: 0px;
                                              padding-left: 0px;
                                            " valign="top">
                                                                            <table
                                                                                align="center"
                                                                                border="0"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                class="divider_content"
                                                                                height="01"
                                                                                role="presentation"
                                                                                style="
                                                table-layout: fixed;
                                                vertical-align: top;
                                                border-spacing: 0;
                                                border-collapse: collapse;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                border-top: 0px solid transparent;
                                                height: 01px;
                                                width: 100%;
                                              " valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="vertical-align: top"
                                                                                        valign="top">
                                                                                        <td
                                                                                            height="1"
                                                                                            style="
                                                      word-break: break-word;
                                                      vertical-align: top;
                                                      -ms-text-size-adjust: 100%;
                                                      -webkit-text-size-adjust: 100%;
                                                    " valign="top">
                                                                                            <span></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              "><div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <table border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                class="divider"
                                                                role="presentation" style="
                                        table-layout: fixed;
                                        vertical-align: top;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        min-width: 100%;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      " valign="top" width="100%">
                                                                <tbody>
                                                                    <tr
                                                                        style="vertical-align: top"
                                                                        valign="top">
                                                                        <td
                                                                            class="divider_inner"
                                                                            style="
                                              word-break: break-word;
                                              vertical-align: top;
                                              min-width: 100%;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                              padding-top: 0px;
                                              padding-right: 0px;
                                              padding-bottom: 0px;
                                              padding-left: 0px;
                                            " valign="top">
                                                                            <table
                                                                                align="center"
                                                                                border="0"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                class="divider_content"
                                                                                height="5"
                                                                                role="presentation"
                                                                                style="
                                                table-layout: fixed;
                                                vertical-align: top;
                                                border-spacing: 0;
                                                border-collapse: collapse;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                border-top: 0px solid transparent;
                                                height: 5px;
                                                width: 100%;
                                              " valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="vertical-align: top"
                                                                                        valign="top">
                                                                                        <td
                                                                                            height="5"
                                                                                            style="
                                                      word-break: break-word;
                                                      vertical-align: top;
                                                      -ms-text-size-adjust: 100%;
                                                      -webkit-text-size-adjust: 100%;
                                                    " valign="top">
                                                                                            <span></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
            
                                                        </div>
            
                                                    </div>
                                                </div>
            
                                            </div>
                                        </div>
                                    </div>
            
                                    <div style="background-color: transparent">
                                        <div class="block-grid mixed-two-up" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: #ffffff;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: #ffffff;
                              ">
                                <div class="col num8" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 448px;
                                  width: 453px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 15px;
                                      padding-bottom: 5px;
                                      padding-right: 10px;
                                      padding-left: 10px;
                                    ">
                                        <div style="
                                        color: #44464a;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #44464a;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 14px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            mso-line-height-alt: 17px;
                                            margin: 0;
                                          ">
                                                                        Mã đơn hàng:
                                                                        <span
                                                                            style="color: #fb3c2d"><strong>#${codeOder}</strong></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div style="
                                        color: #44464a;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #44464a;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 14px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            mso-line-height-alt: 17px;
                                            margin: 0;
                                          ">
                                                                        Ngày đặt đơn: ${currentDate}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 15px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <div class="mobile_hide">
                                                                <table border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    class="divider"
                                                                    role="presentation"
                                                                    style="
                                          table-layout: fixed;
                                          vertical-align: top;
                                          border-spacing: 0;
                                          border-collapse: collapse;
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          min-width: 100%;
                                          -ms-text-size-adjust: 100%;
                                          -webkit-text-size-adjust: 100%;
                                        " valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr
                                                                            style="vertical-align: top"
                                                                            valign="top">
                                                                            <td
                                                                                class="divider_inner"
                                                                                style="
                                                word-break: break-word;
                                                vertical-align: top;
                                                min-width: 100%;
                                                -ms-text-size-adjust: 100%;
                                                -webkit-text-size-adjust: 100%;
                                                padding-top: 0px;
                                                padding-right: 0px;
                                                padding-bottom: 0px;
                                                padding-left: 0px;
                                              " valign="top">
                                                                                <table
                                                                                    align="center"
                                                                                    border="0"
                                                                                    cellpadding="0"
                                                                                    cellspacing="0"
                                                                                    class="divider_content"
                                                                                    height="15"
                                                                                    role="presentation"
                                                                                    style="
                                                  table-layout: fixed;
                                                  vertical-align: top;
                                                  border-spacing: 0;
                                                  border-collapse: collapse;
                                                  mso-table-lspace: 0pt;
                                                  mso-table-rspace: 0pt;
                                                  border-top: 0px solid transparent;
                                                  height: 15px;
                                                  width: 100%;
                                                " valign="top" width="100%">
                                                                                    <tbody>
                                                                                        <tr
                                                                                            style="vertical-align: top"
                                                                                            valign="top">
                                                                                            <td
                                                                                                height="15"
                                                                                                style="
                                                        word-break: break-word;
                                                        vertical-align: top;
                                                        -ms-text-size-adjust: 100%;
                                                        -webkit-text-size-adjust: 100%;
                                                      " valign="top">
                                                                                                <span></span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                <div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <table border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                class="divider"
                                                                role="presentation" style="
                                        table-layout: fixed;
                                        vertical-align: top;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        min-width: 100%;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      " valign="top" width="100%">
                                                                <tbody>
                                                                    <tr
                                                                        style="vertical-align: top"
                                                                        valign="top">
                                                                        <td
                                                                            class="divider_inner"
                                                                            style="
                                              word-break: break-word;
                                              vertical-align: top;
                                              min-width: 100%;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                              padding-top: 0px;
                                              padding-right: 0px;
                                              padding-bottom: 0px;
                                              padding-left: 0px;
                                            " valign="top">
                                                                            <table
                                                                                align="center"
                                                                                border="0"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                class="divider_content"
                                                                                height="15"
                                                                                role="presentation"
                                                                                style="
                                                table-layout: fixed;
                                                vertical-align: top;
                                                border-spacing: 0;
                                                border-collapse: collapse;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                border-top: 0px solid transparent;
                                                height: 15px;
                                                width: 100%;
                                              " valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="vertical-align: top"
                                                                                        valign="top">
                                                                                        <td
                                                                                            height="15"
                                                                                            style="
                                                      word-break: break-word;
                                                      vertical-align: top;
                                                      -ms-text-size-adjust: 100%;
                                                      -webkit-text-size-adjust: 100%;
                                                    " valign="top">
                                                                                            <span></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid three-up no-stack" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:680px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="226" style="background-color:transparent;width:226px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top:5px; padding-bottom:5px;background-color:#f9feff;"><![endif]-->
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  background-color: #f9feff;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 15px;
                                      padding-left: 15px;
                                    ">
                                                            <!--<![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                            <div style="
                                        color: #fb3c2d;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #fb3c2d;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 14px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            mso-line-height-alt: 17px;
                                            margin: 0;
                                          ">
                                                                        Tên sản phẩm
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td><td align="center" width="226" style="background-color:transparent;width:226px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top:5px; padding-bottom:5px;background-color:#f9feff;"><![endif]-->
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  background-color: #f9feff;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 15px;
                                      padding-left: 15px;
                                    ">
                                                            <!--<![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                            <div style="
                                        color: #fb3c2d;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #fb3c2d;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 14px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            text-align: center;
                                            mso-line-height-alt: 17px;
                                            margin: 0;
                                          ">
                                                                        Số lượng
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                        <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  background-color: #f9feff;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 15px;
                                      padding-left: 15px;
                                    ">
                                                            <!--<![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                            <div style="
                                        color: #fb3c2d;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #fb3c2d;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 14px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            text-align: right;
                                            mso-line-height-alt: 17px;
                                            margin: 0;
                                          ">
                                                                        Tổng
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>

                                    ${contentHtml}
                                    <!-- ---------------------------------------- -->
                                    <div style="background-color: transparent">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                <div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <table border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                class="divider"
                                                                role="presentation" style="
                                        table-layout: fixed;
                                        vertical-align: top;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        min-width: 100%;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      " valign="top" width="100%">
                                                                <tbody>
                                                                    <tr
                                                                        style="vertical-align: top"
                                                                        valign="top">
                                                                        <td
                                                                            class="divider_inner"
                                                                            style="
                                              word-break: break-word;
                                              vertical-align: top;
                                              min-width: 100%;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                              padding-top: 0px;
                                              padding-right: 0px;
                                              padding-bottom: 0px;
                                              padding-left: 0px;
                                            " valign="top">
                                                                            <table
                                                                                align="center"
                                                                                border="0"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                class="divider_content"
                                                                                height="1"
                                                                                role="presentation"
                                                                                style="
                                                table-layout: fixed;
                                                vertical-align: top;
                                                border-spacing: 0;
                                                border-collapse: collapse;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                border-top: 1px solid #e1ecef;
                                                height: 1px;
                                                width: 100%;
                                              " valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="vertical-align: top"
                                                                                        valign="top">
                                                                                        <td
                                                                                            height="1"
                                                                                            style="
                                                      word-break: break-word;
                                                      vertical-align: top;
                                                      -ms-text-size-adjust: 100%;
                                                      -webkit-text-size-adjust: 100%;
                                                    " valign="top">
                                                                                            <span></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style="background-color: transparent">
                                        <div class="block-grid three-up no-stack" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:680px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="226" style="background-color:transparent;width:226px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 5px; padding-left: 5px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 5px;
                                      padding-left: 5px;
                                    ">
                                                            <div style="
                                        color: #393d47;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #393d47;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 16px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            mso-line-height-alt: 19px;
                                            margin: 0;
                                          ">
                                                                        <span
                                                                            style="font-size: 16px"><strong>Tổng phụ</strong></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 5px;
                                      padding-left: 5px;
                                    ">
                                                            <div style="
                                        color: #393d47;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #393d47;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 16px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            text-align: right;
                                            mso-line-height-alt: 19px;
                                            margin: 0;
                                          ">
                                                                        <span
                                                                            style="font-size: 16px">${countSubtotal}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                                <div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <!--<![endif]-->
                                                            <table border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                class="divider"
                                                                role="presentation" style="
                                        table-layout: fixed;
                                        vertical-align: top;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        min-width: 100%;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      " valign="top" width="100%">
                                                                <tbody>
                                                                    <tr
                                                                        style="vertical-align: top"
                                                                        valign="top">
                                                                        <td
                                                                            class="divider_inner"
                                                                            style="
                                              word-break: break-word;
                                              vertical-align: top;
                                              min-width: 100%;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                              padding-top: 0px;
                                              padding-right: 0px;
                                              padding-bottom: 0px;
                                              padding-left: 0px;
                                            " valign="top">
                                                                            <table
                                                                                align="center"
                                                                                border="0"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                class="divider_content"
                                                                                height="1"
                                                                                role="presentation"
                                                                                style="
                                                                                    table-layout: fixed;
                                                                                    vertical-align: top;
                                                                                    border-spacing: 0;
                                                                                    border-collapse: collapse;
                                                                                    mso-table-lspace: 0pt;
                                                                                    mso-table-rspace: 0pt;
                                                                                    border-top: 1px solid #e1ecef;
                                                                                    height: 1px;
                                                                                    width: 100%;
                                                                                "
                                                                                valign="top"
                                                                                width="100%">
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="vertical-align: top"
                                                                                        valign="top">
                                                                                        <td
                                                                                            height="1"
                                                                                            style="
                                                      word-break: break-word;
                                                      vertical-align: top;
                                                      -ms-text-size-adjust: 100%;
                                                      -webkit-text-size-adjust: 100%;
                                                    " valign="top">
                                                                                            <span></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid three-up no-stack" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 5px;
                                      padding-left: 5px;
                                    ">
                                                            <div style="
                                        color: #393d47;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #393d47;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 16px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            mso-line-height-alt: 19px;
                                            margin: 0;
                                          ">
                                                                        <span
                                                                            style="font-size: 16px"><strong>Giảm</strong></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col num4" style="
                                  display: table-cell;
                                  vertical-align: top;
                                  max-width: 320px;
                                  min-width: 224px;
                                  width: 226px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 5px;
                                      padding-left: 5px;
                                    ">
                                        <div style="
                                        color: #393d47;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #393d47;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 16px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            text-align: right;
                                            mso-line-height-alt: 19px;
                                            margin: 0;
                                          ">
                                                                        <span
                                                                            style="font-size: 16px">0 VND</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                <div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    ">
                                                            <table border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                class="divider"
                                                                role="presentation" style="
                                        table-layout: fixed;
                                        vertical-align: top;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        min-width: 100%;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      " valign="top" width="100%">
                                                                <tbody>
                                                                    <tr
                                                                        style="vertical-align: top"
                                                                        valign="top">
                                                                        <td
                                                                            class="divider_inner"
                                                                            style="
                                              word-break: break-word;
                                              vertical-align: top;
                                              min-width: 100%;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                              padding-top: 0px;
                                              padding-right: 0px;
                                              padding-bottom: 0px;
                                              padding-left: 0px;
                                            " valign="top">
                                                                            <table
                                                                                align="center"
                                                                                border="0"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                class="divider_content"
                                                                                height="1"
                                                                                role="presentation"
                                                                                style="
                                                table-layout: fixed;
                                                vertical-align: top;
                                                border-spacing: 0;
                                                border-collapse: collapse;
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                border-top: 1px solid #e1ecef;
                                                height: 1px;
                                                width: 100%;
                                              " valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr
                                                                                        style="vertical-align: top"
                                                                                        valign="top">
                                                                                        <td
                                                                                            height="1"
                                                                                            style="
                                                      word-break: break-word;
                                                      vertical-align: top;
                                                      -ms-text-size-adjust: 100%;
                                                      -webkit-text-size-adjust: 100%;
                                                    " valign="top">
                                                                                            <span></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color: transparent">
                                        <div class="block-grid" style="
                              min-width: 320px;
                              max-width: 680px;
                              overflow-wrap: break-word;
                              word-wrap: break-word;
                              word-break: break-word;
                              margin: 0 auto;
                              background-color: transparent;
                            ">
                                            <div style="
                                border-collapse: collapse;
                                display: table;
                                width: 100%;
                                background-color: transparent;
                              ">
                                <div class="col num12" style="
                                  min-width: 320px;
                                  max-width: 680px;
                                  display: table-cell;
                                  vertical-align: top;
                                  width: 680px;
                                ">
                                                    <div class="col_cont"
                                                        style="width: 100% !important">
                                                        <div style="
                                      border-top: 0px solid transparent;
                                      border-left: 0px solid transparent;
                                      border-bottom: 0px solid transparent;
                                      border-right: 0px solid transparent;
                                      padding-top: 5px;
                                      padding-bottom: 5px;
                                      padding-right: 5px;
                                      padding-left: 5px;
                                    ">
                                        <div style="
                                        color: #fb3c2d;
                                        font-family: Nunito, Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        line-height: 1.2;
                                        padding-top: 10px;
                                        padding-right: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 10px;
                                      ">
                                                                <div
                                                                    class="txtTinyMce-wrapper"
                                                                    style="
                                          line-height: 1.2;
                                          font-size: 12px;
                                          color: #fb3c2d;
                                          font-family: Nunito, Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14px;
                                        ">
                                                                    <p style="
                                            font-size: 22px;
                                            line-height: 1.2;
                                            word-break: break-word;
                                            text-align: right;
                                            mso-line-height-alt: 26px;
                                            margin: 0;
                                          ">
                                                                        <span
                                                                            style="font-size: 22px"><strong><span
                                                                                    style>Tổng
                                                                                    ${countSubtotal}</span></strong></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            
            </html>`,
        }).then(() => {
            res.clearCookie("oders");
            if (req.cookies.discount) {
              discountModel.update({
                status: 0
              },{
                where: { code: req.cookies.discount.code }
              }).then(() => {
                res.clearCookie("discount");
              })
            }
            res.render('confirmation/index', {
                title: 'Cảm ơn'
            });
        }).catch(err => {
            console.log(err);
        });

    }

    async profileDetails(req, res) {

        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }
        const user = await userModel.findOne({
          include: [
            { model: roleModel },
          ],
          where: {
            id: checkLogin.id
          }
        });

        res.render('profile/index', {
            title: 'Thông tin người dùng',
            user: user.dataValues
        });
    }

    async order(req, res) {

        var checkLogin = false;
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
        }
        const orderData = await oderModel.findAll({
          include: [
              { model: addressModel },
              { model: userModel },
            ],
          attributes: ['id', 'code', 'payment', 'status', 'id_user', 'id_address','createdAt'],
          where: {id_user: checkLogin.id}
      });

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
      
      const oderDetail = mutipleConvertToObject(orderData);
        res.render('profile/oder/index', {
            title: 'Đơn hàng',
            user: checkLogin,
            oderDetail: oderDetail,
            oders: orderNew,
            count_cart: count_cart
        });
    }

    async address(req, res) {

        var checkLogin = false;
        var address = [];
        if (req.cookies.login) {
            checkLogin = req.cookies.login;
            var addressArray = await addressModel.findAll({
                attributes: ['id', 'address', 'phone', 'name', 'city', 'zip_code'],
                where: { id_user: checkLogin.id }
            })
            address = mutipleConvertToObject(addressArray);
        }

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

        res.render('profile/address/index', {
            title: 'Địa chỉ',
            user: checkLogin,
            address: address,
            oders: orderNew,
            count_cart: count_cart
        });
    }

    contact(req, res) {

      var checkLogin = false;
      if (req.cookies.login) {
          checkLogin = req.cookies.login;
      }

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
      res.render('contact/index', {
          title: 'Liên hệ',
          oders: orderNew,
          count_cart: count_cart,
          user: checkLogin

      });
    }

    async updateAddress(req, res) {

      if (req.body.id == "") {
          addressModel.create({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            city: req.body.city,
            zip_code: req.body.zipcode,
            id_user : req.params.idUser
        }).then(() => {
          res.redirect('/checkout');
        })
      } else {
        addressModel.update({
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          city: req.body.phone,
          zip_code: req.body.zipcode,
          id_user : req.params.idUser
      },
      {
        where: { id: req.body.id }
      }).then(() => {
        res.redirect('/checkout');
      })
      }
    }

    deleteCart (req, res) {
      const idOrder = req.params.id;
      const oders = getOder(req);
        var cart = [];
        if(oders) {
            oders.forEach(oder => {
              if(oder.id != idOrder) {
                cart.push(oder);
              }
            });
        }
        var options = {
          maxAge: 1000 * 60 * 60,
          httpOnly: true
      }
      res.cookie('oders', cart, options)
      res.redirect('/cart');
    }

    async search(req, res) {
      var key = null;
      if (req.query.key) {
        key = req.query.key;

        const fullUrl = req.protocol + '://' + req.get('host');
        const productData = await productModel.findAll({
            attributes: ['id', 'name', 'price', 'detail', 'quantity', 'status'],
            where: {
              name: {
                  [Op.like]: `%${key}%`
              }
          }
        })
        const products = mutipleConvertToObject(productData);


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

        res.render('search/index', {
            title: 'Tìm kiếm',
            key: key,
            hostName: fullUrl,
            products: products,
            oders: orderNew,
            count_cart: count_cart,
            user: checkLogin,
        })
      }

    }

    async discount(req, res) {

      var checkLogin = false;
      if (req.cookies.login) {
          checkLogin = req.cookies.login;
      }

      const discountData = await discountModel.findAll({
        attributes: ['id', 'code', 'discount', 'startDate', 'endDate', 'id_user', 'status'],
        where: { id_user: checkLogin.id}
      });

      const discounts = mutipleConvertToObject(discountData);
      var arrayData = [];
      const currentDate = new Date().toISOString().split('T')[0];
      console.log(currentDate);
      discounts.forEach(data => {
         
          if(data.status == 1) {
              data.status = "Chưa sử dụng";
              data.color = "label-success";
          } else {
              data.status = "Đã sử dụng";
              data.color = "label-danger";
          }
          if (data.endDate < currentDate) {
            data.status = "Đã hết hạn";
            data.color = "label-danger";
          }
          data.startDate = formatDate(data.startDate);
          data.endDate = formatDate(data.endDate);
          
          arrayData.push(data);
      });

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

      res.render('profile/discount/index', {
        title: 'Mã giảm giá',
        user: checkLogin,
        discounts: arrayData,
        oders: orderNew,
        count_cart: count_cart
      });
      
    }

}

module.exports = new SiteController;