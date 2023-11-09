'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

/**
 * Insert an entry into COSUPERVISORTHESIS table without performing any checks over parameters exis
 * @param {*} id_thesis must exists in THESIS 
 * @param {*} id_theacher must exists in TEACHER
 * @param {*} id_cosupervisor must exists in COSUPERVISOR
 * @returns 3-tuple of the ids
 */
exports.addCoSupervisorThesis = (id_thesis, id_theacher, id_cosupervisor) => {
    const sql = "INSERT INTO CoSupervisorThesis(id_thesis, id_teacher, id_cosupervisor) VALUES (?, ?, ?)"

    return new Promise( (resolve, reject) => {
        db.run(sql, [id_thesis, id_theacher, id_cosupervisor], (err) => {
            if(err)
                reject(err)
            resolve((id_thesis, id_theacher, id_cosupervisor))
        })
    })
}

exports.findThesisByCoSupervisorId = (id)=>{
    let idsThesis = [];
    const sqlIdThesis = "SELECT id_thesis FROM CoSupervisorThesis WHERE id_cosupervisor = ?";
    return new Promise((resolve, reject)=>{
        db.all(sqlIdThesis, [idsCo], (err, rows)=>{
            if (err) {
                reject(err);
                return;
            }
            rows.map((e)=>{
                idsThesis.push(e.id_thesis);
            });
            resolve(idsThesis);
        });
    });
}

exports.findCoSupervisorIdsByThesisId = (id)=>{
    const sqlCoSupervisor = "SELECT id_teacher, id_cosupervisor AS surname FROM CoSupervisorThesis WHERE id_thesis = ?";
    return new Promise((resolve, reject)=>{
        db.all(sqlCoSupervisor, [id], (err, rows)=>{
            if (err) {
                reject(err);
                return;
            }
            const res = rows.map((e)=>{
                if(e.id_teacher==0 || e.id_teacher==null)
                    return {idCoSupervisor:e.id_cosupervisor};
                else if(e.id_cosupervisor==0 || e.id_cosupervisor==null)
                    return {idTeacher:e.id_teacher};
        });
            resolve(res);
        }); 
    });
}