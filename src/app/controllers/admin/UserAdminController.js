
const userModel = require('../../models/userModel');
const roleModel = require('../../models/RoleModel');
const { mutipleConvertToObject } = require('../../../util/convert');
const path = require('path');
const bcrypt = require("bcrypt")
const fs = require('fs');
class UserAdminController {

    // get
    async index(req, res) {

        const userData = await userModel.findAll({
            include: roleModel,
            attributes: ['id', 'firstname', 'lastname', 'email', 'status', 'id_role']
        });

        const fullUrl = req.protocol + '://' + req.get('host');

        const users = mutipleConvertToObject(userData);
        var arrayUser = [];
        users.forEach(data => {
            
            if (data.status == 1) {
                data.status = 'Hoạt động';
            }
            if (data.status == 0) {
                data.status = 'Đã khóa';
            }
            arrayUser.push(data);
        });

        const message = req.flash('success')[0] || '';
        res.render('user/allUser', {
            title: 'Người dùng',
            hostName: fullUrl,
            users: arrayUser,
            message: message
        });
    }

    async save(req, res) {
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            id_role: req.body.id_role
        }
        if (req.body.status == 'on') {
            data.status = 1;
        } else {
            data.status = 0;
        }
        if (req.files) {
            const { image } = req.files;
            image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'avatar', image.name));
            const imagePatch = path.join('web', 'images', 'avatar', image.name);
            data.image = imagePatch.replaceAll(/\\/g, "/");
        }
        // req.body
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            data.password = hash;
            userModel.create(data).then(() => {
                req.flash('success', 'Thêm người dùng thành công!')
                res.redirect('/admin/user');
            });
        })
    }

    edit(req, res) {
        const fullUrl = req.protocol + '://' + req.get('host');
        userModel.findOne({
            include: roleModel,
            attributes: ['id', 'firstname', 'lastname', 'email', 'status', 'id_role'],
            where: { id: req.params.id }
        })
            .then(user => {
                res.render('user/editUser', {
                    title: user.name,
                    hostName: fullUrl,
                    user: user.dataValues
                });
            })
            .catch(err => next(err))

    }

    async update(req, res) {
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            id_role: req.body.id_role
        }
        if (req.body.status == 'on') {
            data.status = 1;
        } else {
            data.status = 0;
        }
        const user = await userModel.findOne({
            attributes: ['id', 'image', 'password'],
            where: { id: req.params.id }
        })
        if (req.body.password) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                data.password = hash;
            })
        } else {
            data.password = user.dataValues.password;
        }
        if (req.files) {
            var filePath = path.join(__dirname, '../../../', 'public', 'web', 'images', 'avatar', user.dataValues.image);
            const existsFile = fs.existsSync(filePath)
            if (existsFile) {
                fs.unlinkSync(filePath);
            }
            const { image } = req.files;
            image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'avatar', image.name));
            const imagePatch = path.join('web', 'images', 'avatar', image.name);
            data.image = imagePatch.replaceAll(/\\/g, "/");
        }
        userModel.update(data, {
            where: { id: req.params.id }
        }).then(() => {
            req.flash('success', 'Cập nhật người dùng thành công!')
            res.redirect('/admin/user');
        })
        .catch(err => next(err))
    }

    // delete(req, res) {
    //     sliderModel.destroy({
    //         where: { id: req.params.id }
    //     }).then(() => {
    //         return  res.redirect('/admin/slider');
    //     });
    // }

}




module.exports = new UserAdminController;