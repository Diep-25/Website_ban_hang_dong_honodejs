const db = require('../../config/db');
const { Sequelize, DataTypes, Model } = require('sequelize');
const UserModel = require("./UserModel");
const ProductImageModel = require("./ProductImageModel");

class ProductModel extends Model {}

ProductModel.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, maxLength: 255 },
    price: { type: DataTypes.INTEGER, maxLength: 255 },
    detail: { type: DataTypes.TEXT },
    quantity: { type: DataTypes.INTEGER, maxLength: 255 },
    status: { type: DataTypes.INTEGER, maxLength: 255 },
    id_user: { type: DataTypes.INTEGER, maxLength: 255 },
}, {
    sequelize: db.sequelize,
    modelName: 'Product',
    tableName: 'products'
});

ProductModel.hasMany(ProductImageModel, { foreignKey: 'id_product', as: 'images' });

ProductModel.belongsTo(UserModel, {
    foreignKey: 'id_user',
    targetKey: 'id'
});

// Tự động tạo bảng trong cơ sở dữ liệu nếu chưa tồn tại
ProductModel.sync();

module.exports = ProductModel;