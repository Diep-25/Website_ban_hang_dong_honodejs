const db = require('../../config/db');
const {DataTypes} = require("sequelize");

const RoleModel = db.sequelize.define("roles", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: { type: DataTypes.STRING, maxLength: 255 },
});

module.exports = RoleModel