const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const UserModel = require("./UserModel");

const AddressModel = db.sequelize.define("address", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, maxLength: 255 },
    address: { type: DataTypes.STRING, maxLength: 255 },
    phone: { type: DataTypes.STRING, maxLength: 255 },
    city: { type: DataTypes.STRING, maxLength: 255 },
    zip_code: { type: DataTypes.INTEGER},
    id_user: { type: DataTypes.INTEGER}
});

AddressModel.belongsTo(UserModel, {
    foreignKey: 'id_user', // Tên cột khóa ngoại trong bảng address
    targetKey: 'id' // Tên cột khóa trong bảng cha (users)
});

module.exports = AddressModel