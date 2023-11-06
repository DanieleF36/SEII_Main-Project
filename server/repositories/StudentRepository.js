'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

exports.prova = () =>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Student';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("ciao");
        });
    });
};