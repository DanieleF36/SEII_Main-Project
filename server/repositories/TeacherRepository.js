'use strict';

const sqlite = require('sqlite3');

const db = require("./db");

/**
 * Given a teacher's id, returns all the stored information
 * @param {*} id teacher's id
 * @returns all the teacher's information
 */
exports.findById = (id)=>{
    const sqlTeacher = "SELECT * FROM Teacher WHERE id = ?";
    return new Promise((resolve, reject)=>{
        db.get(sqlTeacher, [id], (err, row)=>{
            if (err) {
                reject(err);
                return;
            }
            if(row==undefined)
                return resolve({});
            resolve({id: row.id, name: row.name, surname:row.surname, email:row.email, codGroup:row.cod_group, codDep:row.cod_dep});
        });
    });
}

exports.findByEmail = (email)=>{
    if(!email)
        throw new Error("email must exist")
    const sqlTeacher = "SELECT * FROM Teacher WHERE email = ?";
    return new Promise((resolve, reject)=>{
        db.get(sqlTeacher, [email], (err, row)=>{
            if (err) {
                reject({error: err.message});
                return;
            }
            if(row==undefined)
                return resolve({});
            resolve({id: row.id, name: row.name, surname:row.surname, email:row.email, codGroup:row.cod_group, codDep:row.cod_dep});
        });
    });
}

exports.getTeacherEmail = (teacherID) => {
    if(!teacherID || teacherID<0)
        throw new Error("teacherID must exists and be greather than 0")
    const teacherMailSQL = 'SELECT email FROM Teacher WHERE id = ? '
    return new Promise((resolve, reject) => {
      db.get(teacherMailSQL, [teacherID], function (err, result) {
        if (err) {
          console.error("Error in SQLDatabase:", err.message);
          reject({error: err.message});
        } else {
          resolve(result.email);
        }
      });
    });
  };

/**
 * Perfoms a search according to the following possible combinations:
 * 1. surname and name are defined, okay
 * 2. only surname is defined, okay
 * 3. only name is defined, error (never possible if checks are done over surname at controller level)
 * 4. none of them are defined, error (never possible)
 * 
 * This will return a list of ids because more supervisor with same name/lastname pair could exist
 * 
 * @param {String} surname, must be defined
 * @param {String} name, could be undefined
 * @returns [id1, id2, ...]
 */
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