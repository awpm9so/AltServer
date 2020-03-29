const { Router } = require('express');
const router = Router();
const db = require('../db/db');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })



const redirectLogin = (req, res, next) => {
    if (!req.session.id_user) {
        res.redirect('/login')
    }
    else {
        next();
    }
}
const redirectHome = (req, res, next) => {
    if (req.session.id_user) {
        res.redirect('/home?id_user=' + req.session.id_user)
    }
    else {
        next();
    }
}

//аторизация
router.post('/login', urlencodedParser, redirectHome, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    try {

        let results = await db.login(req.body.login, req.body.password);
        if (results.length == 1) {
            req.session.id_user = results[0].id_user;
            req.session.avatar = results[0].avatar;
            res.redirect('list?id_user=' + results[0].id_user);
            //res.render('table', { id_user: results[0].id_user, layout: false });
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
router.post('/signup', urlencodedParser, redirectHome, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    try {
        let results = await db.check_user(req.body.login);
        if (results.length != 0) {
            res.send('Such login already exists');
        }
        else {
            await db.signup(req.body.login, req.body.password);
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);

    }
});

router.get('/list', redirectLogin, (req, res) => {
    //для того, чтобы нельзя было вернуться на /list после нажатия Logout и "Назад" в браузере
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    res.render('table', { id_user: req.session.id_user, layout: false });
});



//вывод записей пользователя
router.get('/table', urlencodedParser, redirectLogin, async (req, res) => {
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

router.get('/account', redirectLogin, async (req, res, next) => {
    //для того, чтобы нельзя было вернуться на /account после нажатия Logout и "Назад" в браузере
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    if (req.session.avatar) {
        res.render('account', { page_title: "Мой профиль", check_avatar: true, avatar: req.session.avatar, layout: 'home' });
    }
    else {
        res.render('account', { page_title: "Мой профиль", check_avatar: false, avatar: req.session.avatar, layout: 'home' });
    }

});

router.get('/logout', redirectLogin, (req, res, next) => {
    if (req.session.id_user) {
        req.session.destroy(function () {
            res.redirect('/');
        });
    }
});

module.exports = router;

