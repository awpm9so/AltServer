const mysql = require('mysql');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'altdb',
    port: '3306'
});


let altdb = {};


altdb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM message', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.oneUser = (id_user, sort) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM message WHERE id_user = ${id_user} ORDER BY ${sort}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.login = (login, password) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM user WHERE login LIKE ? AND password LIKE ?`, [login, password], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.check_user = (login) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM user WHERE login LIKE ? `, [login], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.signup = (login, password) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO `user` (`id_user`, `login`, `password`) VALUES (NULL, ? , ?)", [login, password], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.add_message = (value, id_user) => {
    return new Promise((resolve, reject) => {

        pool.query("INSERT INTO`message`(`id`, `value`, `id_user`) VALUES(NULL, ? , ?);", [value, id_user], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.update_message = (value, id_message) => {
    return new Promise((resolve, reject) => {
        // UPDATE`message` SET`value` = 'ИЗМЕНЕНО прямо сейчас' WHERE`message`.`id` = 4
        pool.query("UPDATE`message` SET`value` = ? WHERE`message`.`id` = ?", [value, id_message], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

altdb.delete_message = (id_message) => {
    return new Promise((resolve, reject) => {
        "DELETE FROM `message` WHERE `message`.`id` = 17"
        pool.query("DELETE FROM `message` WHERE `message`.`id` = ?", [id_message], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};


module.exports = altdb;