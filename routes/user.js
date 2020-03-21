const { Router } = require('express');
const router = Router();
const db = require('../db/db');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//аторизация
router.post('/login', urlencodedParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    try {
        //console.log(req.body.login);
        //console.log(req.body.password);
        let results = await db.login(req.body.login, req.body.password);
        if (results.length == 1) {
            // res.redirect('/table?user=' + results[0].id_user + '&sort=asc_num');
            res.render('table', { id_user: results[0].id_user, layout: false });
            //res.redirect('/static/html/table.html');
        }
        else {
            res.send("Sorry, I don`t know you");
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);

    }
});

//регистрация
router.post('/signup', urlencodedParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    try {
        //console.log(req.body.login);
        //console.log(req.body.password);
        let results = await db.check_user(req.body.login);
        if (results.length != 0) {
            res.send('Such login already exists');
        }
        else {
            let signup = await db.signup(req.body.login, req.body.password);
            console.log('signup user: ' + signup);
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);

    }
});


//вывод записей пользователя
router.get('/table', urlencodedParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    var sort = [];
    switch (req.query.sort) {
        case 'asc_num': // сортировка по возрастанию id
            sort = ['id']
            break;
        case 'desc_num': //сортировка по убыванию id
            sort = ['id DESC']
            break;
        case 'asc_alp'://сортировка по алфавиту по столбцу value
            sort = ['value']
            break;
        case 'desc_alp': //сортировка по алфавиту(убывание) по столбцу value
            sort = ['value DESC']
            break;
        default:
            alert("Сортировка не задана!");
    }

    try {
        let results = await db.oneUser(req.query.user, sort);
        res.render("tab", { messages: results, layout: false });


    } catch (e) {
        console.log(e);
        res.sendStatus(500);

    }

});

module.exports = router;
