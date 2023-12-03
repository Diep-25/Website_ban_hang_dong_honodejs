const express = require('express');
const morgan = require('morgan');
const { engine } =  require('express-handlebars');
const path = require('path');
const app = express();
const port = 3000;
const route = require('./routers');
const db = require('./config/db')
const helpers = require('./helpers');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session')
const flash = require('connect-flash');

app.use(cookieParser())
app.use(fileUpload());

app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000},
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

//connect mysql
db.sequelize;
//install folder public images
app.use(express.static(path.join(__dirname, 'public')));
// HTTP logger
app.use(morgan('combined'));
// Template
app.engine('hbs', engine({
  extname: ".hbs",
  helpers: helpers,
}));

app.set('view engine', 'hbs');
app.set('views', [
  path.join(__dirname, 'resources', 'views','web'),
  path.join(__dirname, 'resources', 'views','admin'),
]);

// app.engine.registerHelper('raw', function(options) {
//   return options.fn(this);
// });

//middewere
app.use(express.urlencoded({
  extended : true
}));
app.use(express.json());

// routing

route(app);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});