const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const UserModel = require("./UserModel");

const SliderModel = db.sequelize.define("sliders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, maxLength: 255 },
    content: { type: DataTypes.STRING, maxLength: 255 },
    image: { type: DataTypes.STRING, maxLength: 255 },
    url: { type: DataTypes.STRING, maxLength: 255 },
    attribute: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER },
    id_user: { type: DataTypes.INTEGER },
});

SliderModel.belongsTo(UserModel, {
    foreignKey: 'id_user', // Tên cột khóa ngoại trong bảng products
    targetKey: 'id' // Tên cột khóa trong bảng cha (users)
});

module.exports = SliderModel