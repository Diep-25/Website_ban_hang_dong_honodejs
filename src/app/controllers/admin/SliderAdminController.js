
const sliderModel = require('../../models/SliderModel');
const { mutipleConvertToObject } = require('../../../util/convert');
const path = require('path');
const fs = require('fs');
class SliderAdminController {

    // get
    async index(req, res) {

        const sliderData = await sliderModel.findAll({
            attributes: ['id', 'name', 'content', 'url', 'image', 'attribute']
        });

        const fullUrl = req.protocol + '://' + req.get('host');

        const sliders = mutipleConvertToObject(sliderData);

        for (let index = 0; index < sliders.length; index++) {
            if (sliders[index].attribute == 1) {
                sliders[index].attribute = 'Left';
            }
            if (sliders[index].attribute == 2) {
                sliders[index].attribute = 'Center';
            }
            if (sliders[index].attribute == 3) {
                sliders[index].attribute = 'Right';
            }
        }

        res.render('slider/sliderAdmin', {
            title: 'Slider',
            hostName: fullUrl,
            sliders: sliders,
            message: req.flash('create')
        });
    }

    async save(req, res) {
        const { image } = req.files;
        image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'slider', image.name));
        const imagePatch = path.join('web', 'images', 'slider', image.name);
        // req.body
        await sliderModel.create({
            name: req.body.name,
            content: req.body.content,
            image: imagePatch.replaceAll(/\\/g, "/"),
            url: req.body.url,
            attribute: req.body.attribute,
            status: 1,
            id_user: 1,
        });
        req.flash('create', 'Thêm slider thành công!')
        res.redirect('/admin/slider');
    }
    edit(req, res) {
        const fullUrl = req.protocol + '://' + req.get('host');
        sliderModel.findOne({
            attributes: ['id', 'name', 'content', 'url', 'image', 'attribute'],
            where: { id: req.params.id }
        })
            .then(slider => {
                res.render('slider/editSlider', {
                    title: slider.name,
                    hostName: fullUrl,
                    slider: slider.dataValues
                });
            })
            .catch(err => next(err))

    }

    async update(req, res) {
        var data = {
            name: req.body.name,
            content: req.body.content,
            url: req.body.url,
            attribute: req.body.attribute,
            status: 1,
            id_user: 1,
        }

        const slider = await sliderModel.findOne({
            attributes: ['id', 'image'],
            where: { id: req.params.id }
        })
        var imagePatch = '';
        if (req.files) {
            var filePath = path.join(__dirname, '../../../', 'public', slider.dataValues.image);
            const existsFile = fs.existsSync(filePath)
            if (existsFile) {
                fs.unlinkSync(filePath);
            }
            const { image } = req.files;
            image.mv(path.join(__dirname, '../../../', 'public', 'web', 'images', 'slider', image.name));
            imagePatch = path.join('web', 'images', 'slider', image.name);
            data.image = imagePatch.replaceAll(/\\/g, "/");
        }
        sliderModel.update(data, {
            where: { id: req.params.id }
        }).then(slider => {
            res.redirect('/admin/slider');
        })
        .catch(err => next(err))
    }

    delete(req, res) {
        sliderModel.destroy({
            where: { id: req.params.id }
        }).then(() => {
            return  res.redirect('/admin/slider');
        });
    }

}




module.exports = new SliderAdminController;