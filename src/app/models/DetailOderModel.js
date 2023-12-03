const db = require('../../config/db');
const {DataTypes} = require("sequelize");
const ProductModel = require("./ProductModel");
const OderModel = require("./OderModel");

const DetailOderModel = db.sequelize.define("detail_orders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER },
    id_product: { type: DataTypes.INTEGER},
    id_order: { type: DataTypes.INTEGER},
});

DetailOderModel.belongsTo(ProductModel, {
    foreignKey: 'id_product', // Tên cột khóa ngoại trong bảng Oder
    targetKey: 'id' // Tên cột khóa trong bảng cha (product)
});

DetailOderModel.belongsTo(OderModel, {
    foreignKey: 'id_order', // Tên cột khóa ngoại trong bảng Oder
    targetKey: 'id' // Tên cột khóa trong bảng cha (product)
});


module.exports = DetailOderModel