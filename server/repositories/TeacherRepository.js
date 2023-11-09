'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

exports.findById = (id)=>{
    const sqlTeacher = "SELECT * FROM Teacher WHERE id = ?";
    return new Promise((resolve, reject)=>{
        db.get(sqlTeacher, [id], (err, row)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve({id: row.id, name: row.name, surname:row.surname, email:row.email, codGroup:row.cod_group, codDep:row.cod_dep});
        });
    });
}

//return ids of teachers that have sometingh like them surname or name and surname
exports.findByNSorS = (surname, name)=>{
    let sql = "SELECT id FROM Teacher WHERE ";
    let params = [];
    if(name != null && surname != null){
        sql+="name LIKE ? AND surname LIKE ?";
        params.push("%"+name+"%");
        params.push("%"+surname+"%");
    }
    else{
        sql+="surname LIKE ?";
        params.push("%"+surname+"%");
    }
    return new Promise((resolve, reject)=>{
        db.all(sql, params, (err, rows)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
//support method that translate a teacher into a supervisor
exports.fromTeacherToCoSupervisor= (teacher)=>{
    return {email:teacher.email, name:teacher.name, surname:teacher.surname, company:"PoliTo"};
}