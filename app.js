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
app.get('/:sort', urlencodedParser, (req, res)=>{
    res.set('Access-Control-Allow-Origin', '*') 
    var sort= [];
    switch (req.params.sort) {
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
          alert( "Сортировка не задана!" );
      }
    let sql = 'SELECT * FROM message ORDER BY '+ sort;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render("index", {messages: result});

    });
   
});


//добавление новой записи
app.post('/', urlencodedParser, function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')    
    if (!req.body) return res.sendStatus(400);
    let post = {value: req.body.message};
    let sql = `INSERT INTO message SET ?`;

    let query = db.query(sql, post, (err, results) => {
        if (err) res.send(JSON.stringify('Ошибка при добавлении записи!'))
        else
        res.send(JSON.stringify('Запись добавлена!'))
    }); 
  })


app.post('/:id',urlencodedParser, function (req, res){
    res.set('Access-Control-Allow-Origin', '*') 
    let sql = `UPDATE message SET value=? WHERE id=?`;
    
    let query = db.query(sql, [req.body.edit, req.params.id], (err, results) => {
        if (err) {
            res.send(JSON.stringify('Ошибка при редактировании!'))
        }
        else
        res.send(JSON.stringify('Редактирование прошло успешно!'))
    });
});

app.post('/delete/:id',urlencodedParser, function (req, res){
    res.set('Access-Control-Allow-Origin', '*') 
    let sql = `DELETE FROM message WHERE id=?`;
    
    let query = db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            res.send(JSON.stringify('Ошибка при удалении!'))
        }
        else
        res.send(JSON.stringify('Удаление прошло успешно!'))
    });
});



app.listen('3000', () => {
 console.log('Server started!!!');
});


module.exports = app;