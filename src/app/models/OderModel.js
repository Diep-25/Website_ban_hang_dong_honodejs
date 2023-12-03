const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const UserModel = require("./UserModel");
const AddressModel = require("./AddressModel");

const OderModel = db.sequelize.define("oders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payment: { type: DataTypes.INTEGER },
    code: { type: DataTypes.INTEGER},
    status: { type: DataTypes.STRING},
    id_user: { type: DataTypes.INTEGER},
    id_address: { type: DataTypes.INTEGER}
});

OderModel.belongsTo(UserModel, {
    foreignKey: 'id_user', // Tên cột khóa ngoại trong bảng Oder
    targetKey: 'id' // Tên cột khóa trong bảng cha (users)
});
OderModel.belongsTo(AddressModel, {
    foreignKey: 'id_address', // Tên cột khóa ngoại trong bảng Oder
    targetKey: 'id' // Tên cột khóa trong bảng cha (addres)
});

module.exports = OderModel