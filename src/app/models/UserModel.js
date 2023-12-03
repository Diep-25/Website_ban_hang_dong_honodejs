const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const RoleModel = require("./RoleModel");

const UserModel = db.sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, maxLength: 255 },
    lastname: { type: DataTypes.STRING, maxLength: 255 },
    email: { type: DataTypes.STRING, maxLength: 255 },
    password: { type: DataTypes.STRING, maxLength: 255 },
    image: { type: DataTypes.STRING, maxLength: 255 },
    status: { type: DataTypes.INTEGER, defaultValue: 0},
    code: { type: DataTypes.INTEGER},
    id_role: { type: DataTypes.INTEGER, defaultValue: 2 }
});

UserModel.belongsTo(RoleModel, {
    foreignKey: 'id_role', // Tên cột khóa ngoại trong bảng Users
    targetKey: 'id' // Tên cột khóa trong bảng cha (roles)
});

module.exports = UserModel