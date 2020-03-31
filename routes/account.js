const { Router } = require('express');
const router = Router();
var bodyParser = require('body-parser');
const multer = require("multer");
const db = require('../db/db');

const storageConfig = multer.diskStorage({
    destination: "./public/img",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


const redirectLogin = (req, res, next) => {
    if (!req.session.id_user) {
        res.redirect('/login')
    }
    else {
        next();
    }
}

const upload = multer({ storage: storageConfig, fileFilter: fileFilter }).single("avatar");

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


router.post('/avatar', upload, async (req, res, next) => {

    let avatar = req.file;
    if (!avatar)
        res.send("Ошибка при загрузке файла");
    else {
        try {
            await db.update_avatar(req.session.id_user, avatar.filename);
            req.session.avatar = avatar.filename;
            res.redirect('/account');
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }


});


module.exports = router;
