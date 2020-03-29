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


const upload = multer({ storage: storageConfig, fileFilter: fileFilter }).single("avatar");


router.post('/avatar', upload, async (req, res, next) => {

    let avatar = req.file;
    if (!avatar)
        res.send("Ошибка при загрузке файла");
    else {
        try {
            let results = await db.update_avatar(req.session.id_user, avatar.filename);
            res.render('account', { page_title: "Мой профиль", check_avatar: true, avatar: avatar.filename, layout: 'home' });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }


});


module.exports = router;
