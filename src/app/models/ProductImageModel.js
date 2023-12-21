const db = require('../../config/db');
const { Sequelize, DataTypes, Model } = require('sequelize');
const ProductModel = require("./ProductModel");

class ProductImageModel extends Model {}

ProductImageModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, maxLength: 255 },
    name: { type: DataTypes.STRING, maxLength: 255 },
    id_product: { type: DataTypes.INTEGER },
}, {
    sequelize: db.sequelize,
    modelName: 'ProductImage',
    tableName: 'product_images'
});


// Tự động tạo bảng trong cơ sở dữ liệu nếu chưa tồn tại
ProductImageModel.sync();

module.exports = ProductImageModel;