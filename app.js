const express = require('express');
const mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');

const user = require('./routes/user');
const account = require('./routes/account');
const list = require('./routes/list');

const db = require('./db/db');
const exphbs = require('express-handlebars');
const session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();

app.use(session({
    secret: 'my_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

//app.set('view engine', 'ejs');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.use('/static', express.static(__dirname + '/public'));

app.use(user);
app.use(account);
app.use(list);
//app.use(express.urlencoded({ extended: true }))


const redirectHome = (req, res, next) => {
    if (req.session.id_user) {
        res.redirect('/home?id_user=' + req.session.id_user)
    }
    else {
        next();
    }
}

app.get('/', urlencodedParser, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.render("main", { page_title: "Главная" });

});

app.get('/login', urlencodedParser, redirectHome, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.render("form_login", { page_title: "Авторизация" });
});

app.get('/signup', urlencodedParser, redirectHome, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.render("form_signup", { page_title: "Регистрация" });
});


app.listen('3000', () => {
    console.log('Server started!!!');
});


module.exports = app;