const siteRouter = require('./site/site');
const productRouter = require('./site/product');
const siteAdminRouter = require('./site/admin/site');
const isLoggedIn = require('../middleware/authMiddleware');

function route(app) {
    
    app.use(isLoggedIn);

    app.use('/', siteRouter);

    app.use('/admin', siteAdminRouter);

    app.use('/product', productRouter);

}

module.exports = route;
