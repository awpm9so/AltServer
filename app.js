const express = require('express');
const mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
const user = require('./routes/user');
const db = require('./db/db');
const exphbs = require('express-handlebars');
const session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();

/*
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'altdb'
});

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('MySQL conneceted...');
});
*/


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
    res.render("hello", { page_title: "Главная" });

});

app.get('/login', urlencodedParser, redirectHome, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.render("form_login", { page_title: "Авторизация" });
});

app.get('/signup', urlencodedParser, redirectHome, (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.render("form_signup", { page_title: "Регистрация" });
});




//добавление новой записи
app.post('/', urlencodedParser, async function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    if (!req.body) return res.sendStatus(400);
    try {
        await db.add_message(req.body.message, req.body.user);
        res.send(JSON.stringify('Запись добавлена!'))
    } catch (e) {
        console.log(e);
        res.send(JSON.stringify('Ошибка при добавлении записи!'))
        res.sendStatus(500);
    }
})


app.post('/update', urlencodedParser, async function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    if (!req.body) return res.sendStatus(400);
    try {
        console.log(req.body.edit);
        console.log(req.body.id_message);
        await db.update_message(req.body.edit, req.body.id_message);
        res.send(JSON.stringify('Запись отредактрована!'))
    } catch (e) {
        console.log(e);
        res.send(JSON.stringify('Ошибка при редактировании записи!'))
        res.sendStatus(500);
    }
});


app.post('/delete/', urlencodedParser, async function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    if (!req.body) return res.sendStatus(400);
    try {
        await db.delete_message(req.body.id_message);
        res.send(JSON.stringify('Запись удалена!'))
    } catch (e) {
        console.log(e);
        res.send(JSON.stringify('Ошибка при удалении записи!'))
        res.sendStatus(500);
    }
});







app.listen('3000', () => {
    console.log('Server started!!!');
});


module.exports = app;