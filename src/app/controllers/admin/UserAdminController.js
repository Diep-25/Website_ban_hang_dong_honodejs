
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

        res.render('user/allUser', {
            title: 'Người dùng',
            hostName: fullUrl,
            users: users,
            message: req.flash('create')
        });
    }

    async save(req, res) {
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            status: req.body.status,
            id_role: req.body.id_role
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
                req.flash('create', 'Thêm user thành công!')
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

    // async update(req, res) {
    //     var data = {
    //         name: req.body.name,
    //         content: req.body.content,
    //         url: req.body.url,
    //         attribute: req.body.attribute,
    //         status: 1,
    //         id_user: 1,
    //     }

    //     const slider = await sliderModel.findOne({
    //         attributes: ['id', 'image'],
    //         where: { id: req.params.id }
    //     })
    //     var imagePatch = '';
    //     if (req.files) {
    //         var filePath = path.join(__dirname, '../../../', 'public', slider.dataValues.image);
    //         const existsFile = fs.existsSync(filePath)
    //         if (existsFile) {
    //             fs.unlinkSync(filePath);
    //         }
    //         const { image } = req.files;
    //         image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'slider', image.name));
    //         imagePatch = path.join('web', 'images', 'slider', image.name);
    //         data.image = imagePatch.replaceAll(/\\/g, "/");
    //     }
    //     sliderModel.update(data, {
    //         where: { id: req.params.id }
    //     }).then(slider => {
    //         res.redirect('/admin/slider');
    //     })
    //     .catch(err => next(err))
    // }

    // delete(req, res) {
    //     sliderModel.destroy({
    //         where: { id: req.params.id }
    //     }).then(() => {
    //         return  res.redirect('/admin/slider');
    //     });
    // }

}




module.exports = new UserAdminController;