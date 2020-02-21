var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '52Zllshizhu',
    database: 'mytest'
});

connection.connect();


insert();

function insert () {
    connection.query("INSERT INTO `user` (id, name, psw) VALUES (null, '靳建奇', '52Alsdkfj')", function (error, results, fields) {
        if (!error)
            console.log('insert : OK');
    })
    selectAll();

}

function selectAll () {
    connection.query('SELECT * FROM `user`', function (error, results, fields) {
        console.log(results);
    })
}

