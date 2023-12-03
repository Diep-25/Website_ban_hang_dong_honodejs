const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const UserModel = require("./UserModel");

const ProductModel = db.sequelize.define("products", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, maxLength: 255 },
    image: { type: DataTypes.STRING, maxLength: 255 },
    price: { type: DataTypes.INTEGER, maxLength: 255 },
    detail: { type: DataTypes.TEXT },
    quantity: { type: DataTypes.INTEGER, maxLength: 255 },
    status: { type: DataTypes.INTEGER, maxLength: 255 },
    id_user: { type: DataTypes.INTEGER, maxLength: 255 },
});
ProductModel.belongsTo(UserModel, {
    foreignKey: 'id_user', // Tên cột khóa ngoại trong bảng products
    targetKey: 'id' // Tên cột khóa trong bảng cha (users)
});

module.exports = ProductModel