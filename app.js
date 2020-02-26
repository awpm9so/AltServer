const express = require('express');
const mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser')
 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'altdb'
});

db.connect((err) =>{
    if(err){
        console.log(err);
    }
    console.log('MySQL conneceted...');
});


const app = express();

app.set('view engine', 'ejs');

//вывод всех данных из бд 
app.get('/', (req, res)=>{
    
    let sql = 'SELECT * FROM message';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
     //console.log(result);
        res.render("index", {messages: result});

    });
   
});


//добавление новой записи
app.post('/', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')    
    if (!req.body) return res.sendStatus(400);
    let post = {value: req.body.message};
    let sql = `INSERT INTO message SET ?`;
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        else
        res.send('Запись "' + req.body.message +  '" добавлена!');
    });    
  })




app.listen('3000', () => {
 console.log('Server started!!!');
});


module.exports = app;