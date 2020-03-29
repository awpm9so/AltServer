const { Router } = require('express');
const router = Router();
const db = require('../db/db');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//добавление новой записи
router.post('/', urlencodedParser, async function (req, res) {
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

//редактирвание записи
router.post('/update', urlencodedParser, async function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    if (!req.body) return res.sendStatus(400);
    try {
        await db.update_message(req.body.edit, req.body.id_message);
        res.send(JSON.stringify('Запись отредактрована!'))
    } catch (e) {
        console.log(e);
        res.send(JSON.stringify('Ошибка при редактировании записи!'))
        res.sendStatus(500);
    }
});

//удаление записи
router.post('/delete/', urlencodedParser, async function (req, res) {
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

module.exports = router;

