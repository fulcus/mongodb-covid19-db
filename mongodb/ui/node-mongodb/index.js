require('./models/db')

const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const {engine} = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyparser = require('body-parser');

const certificateController = require("./controllers/certificateController");

var app = express();

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send('<h2>Welcome to the COVID19 Database!</h2><h3>Click here to get access to the <b><a href="/certificate/list">Database</a></b></h3>')
});

app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'))

app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    extname: '.hbs',
    defaultLayout: 'MainLayout',
    layoutsDir: __dirname + '/views/layouts/'
}));

app.set('view engine', 'handlebars');

app.listen(3000, () => {
    console.log('server started at port 3000');
});

app.use('/certificate', certificateController);