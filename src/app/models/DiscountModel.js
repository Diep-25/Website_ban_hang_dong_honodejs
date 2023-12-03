const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const UserModel = require("./UserModel");

const DetailOderModel = db.sequelize.define("discounts", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATE},
    endDate: { type: DataTypes.DATE},
    id_user: { type: DataTypes.INTEGER},
});

DetailOderModel.belongsTo(UserModel, {
    foreignKey: 'id_user', // Tên cột khóa ngoại trong bảng User
    targetKey: 'id' // Tên cột khóa trong bảng cha (product)
});


module.exports = DetailOderModel