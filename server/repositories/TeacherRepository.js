'use strict';

const sqlite = require('sqlite3');
require('dotenv').config({path: './variable.env'})

const db = require("./db");

/**
 * create a new object that represent teacher 
 * @returns 
 */
function newTeacher(id, name, surname, email, codGroup, codDep){
    return {
        id: id,
        name: name, 
        surname: surname, 
        email: email, 
        codGroup:codGroup, 
        codDep:codDep
    }
}

//==================================Create==================================


//==================================Get==================================
/**
 * Given a teacher's id, returns all the stored information
 * @param {*} id teacher's id
 * @returns all the teacher's information
 */
exports.getById = (id)=>{
    if(!id || id<0)
        throw {error: "id must be greather than 0"}
    const sqlTeacher = "SELECT * FROM Teacher WHERE id = ?";
    return new Promise((resolve, reject)=>{
        db.get(sqlTeacher, [id], (err, row)=>{
            if (err) 
                return reject({error: err.message});
            if(row==undefined)
                return resolve({});
            resolve(newTeacher(row.id, row.name, row.surname, row.email, row.cod_group, row.cod_dep));
        });
    });
}

/**
 * Given a teacher's email, returns all the stored information
 * @param {*} email teacher's email
 * @returns all the teacher's information
 */
exports.findByEmail = (email)=>{
    if(!email)
        throw {error:"email must exist"}
    const sqlTeacher = "SELECT * FROM Teacher WHERE email = ?";
    return new Promise((resolve, reject)=>{
        db.get(sqlTeacher, [email], (err, row)=>{
            if (err) {
                reject({error: err.message});
                return;
            }
            if(row==undefined)
                return resolve({});
            resolve(newTeacher(row.id, row.name, row.surname, row.email, row.cod_group, row.cod_dep));
        });
    });
}

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
    else if(surname != null){
        sql+="surname LIKE ?";
        params.push("%"+surname+"%");
    }
    else
        throw {error: "at least surname have to be provided"}
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

//==================================Set==================================

//==================================Delete==================================

//==================================Support==================================

//translate a teacher into a supervisor
exports.fromTeacherToCoSupervisor= (teacher)=>{
    return {email:teacher.email, name:teacher.name, surname:teacher.surname, company:"PoliTo"};
}