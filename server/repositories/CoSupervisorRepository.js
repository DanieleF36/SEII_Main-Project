'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});
exports.findById = (id)=>{
    const sqlCoSupervisor = "SELECT name, surname, email, company FROM CoSupervisor WHERE id = ?";

    return new Promise((resolve, reject)=>{
        db.get(sqlCoSupervisor, [id], (err, row)=>{
            if (err) {
                reject(err);
                return;
            }
            if(!row) 
                resolve({})
            else 
                resolve({name:row.name, surname:row.surname, email:row.surname, company:row.company});

        });
    });
}

//return ids of co-supervisors that have something like them surname or name and surname
exports.findByNSorS = (surname, name)=>{
    let sql = "SELECT id FROM CoSupervisor WHERE ";
    let params = [];
    if(name != null && surname != null){
        sql+="name LIKE ? AND surname LIKE ?";
        params.push("%"+name+"%");
        params.push("%"+surname+"%");
    }
    else{
            sql+="surname LIKE ?";
            params.push("%"+coSupervisor+"%");
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