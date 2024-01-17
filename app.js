const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config()

const port = process.env.SERVER_PORT || 3000;
const app = express();

// Body Parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setting a static folder
app.use(express.static("public"));

// Setting a view-engine -- Express Handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// Connection Pool
const routes = require('./server/routes/user');
app.use('/',routes);

app.listen(port, () => {
    console.log(`App running successfully on port ${port}!`);
});
