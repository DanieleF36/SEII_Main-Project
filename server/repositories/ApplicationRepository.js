'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

exports.listApplication = (id_teacher)=>{
    const sqlTeacher = "SELECT * FROM Application WHERE id_teacher = ?";
    return new Promise((resolve, reject)=>{
        db.all(sqlTeacher, [id_teacher], (err, row)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve({id_student: row.id_student, id_thesis:row.id_thesis, data:row.data, path_cv:row.path_cv, status:row.status, id_teacher:row.id_teacher});
        });
    });
}

exports.accRefApplication = (status)=>{
    const sqlTeacher = "UPDATE Application SET status = ? WHERE id_teacher = ?";
    return new Promise((resolve, reject)=>{
        db.run(sqlTeacher, [status,id_teacher], (err, row)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}