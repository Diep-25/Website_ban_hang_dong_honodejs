const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
   'node_website_ban_hang_dev',
   'root',
   '',
    {
      host: 'localhost',
      dialect: 'mysql'
    }
  );

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database');
});

module.exports = { sequelize };