'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

exports.findById = (id)=>{
    const sqlCoSupervisor = "SELECT C.name AS name C.surname AS surname FROM CoSupervisorThesis CT, CoSupervisor C WHERE CT.id_cosupervisor = C.id AND CT.id_thesis = ?";
    db.get(sqlCoSupervisor, [e.id], (err, row)=>{
        if (err) {
            reject(err);
            return;
        }
        resolve({name:row.name, surname:row.surname, email:row.surname, company:row.company});
    });
}

//return ids of co-supervisors with surname or name and surname
exports.findByNSorS = (name, surname)=>{
    let sql = "SELECT id FROM CoSupervisor WHERE 1=1 ";
    let params = [];
    if(name != null && surname != null){
        if(coSupervisor.split(' '.length==2)){
            sql+="AND C.name AND C.surname=?";
            params.concat(coSupervisor.split(' '));
        }
        else{
            sql+="AND  T.surname=?";
            params.push(coSupervisor);
        }
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