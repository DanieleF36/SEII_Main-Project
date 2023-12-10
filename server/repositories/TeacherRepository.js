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
exports.getById = (id) => {
    if (!(id && id >= 0)) {
      throw new Error('Teacher ID must be greater than or equal to 0');
    }
  
    const fetchTeacherByIdSQL = 'SELECT * FROM Teacher WHERE id = ?';
  
    return new Promise((resolve, reject) => {
      db.get(fetchTeacherByIdSQL, [id], (err, row) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }
  
        if (!row) {
          resolve({});
        } else {
          resolve(newTeacher(row.id, row.name, row.surname, row.email, row.cod_group, row.cod_dep));
        }
      });
    });
  };

/**
 * Given a teacher's email, returns all the stored information
 * @param {*} email teacher's email
 * @returns all the teacher's information
 */
exports.getByEmail = (email) => {
    if (!email) {
      throw new Error('Email must be provided');
    }
  
    const fetchTeacherByEmailSQL = 'SELECT * FROM Teacher WHERE email = ?';
  
    return new Promise((resolve, reject) => {
      db.get(fetchTeacherByEmailSQL, [email], (err, row) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }
  
        if (!row) {
          resolve({});
        } else {
          resolve(newTeacher(row.id, row.name, row.surname, row.email, row.code_group, row.cod_dep));
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
 * This will return a list of teacher Objects because more supervisor with same name/lastname pair could exist
 * 
 * @param {String} surname, must be defined
 * @param {String} name, could be undefined
 * @returns [id1, id2, ...]
 */
exports.getByNSorS = (surname, name) => {
    if (!surname) {
      throw new Error('Surname must be provided');
    }
  
    let sql = 'SELECT * FROM Teacher WHERE ';
    let params = [];
  
    if (name && surname) {
      sql += 'name LIKE ? AND surname LIKE ?';
      params.push('%' + name + '%');
      params.push('%' + surname + '%');
    } else if (surname) {
      sql += 'surname LIKE ?';
      params.push('%' + surname + '%');
    } else {
      throw new Error('At least surname must be provided');
    }
  
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }
        resolve(rows);
      });
    });
  };

/**
 * Support function to retrive the supervisorId given the thesisId
 * @param {*} thesisId
 * @returns supervisorId : integer
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns "Not found" : if there is no match
 */
exports.getIdByThesisId = (thesisId) => {
    if (!(thesisId && thesisId >= 0)) {
      throw new Error('Thesis ID must be greater than or equal to 0');
    }
  
    const fetchSupervisorByThesisIdSQL = 'SELECT id_supervisor FROM Thesis WHERE id = ?';
  
    return new Promise((resolve, reject) => {
      db.get(fetchSupervisorByThesisIdSQL, [thesisId], (err, row) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }
  
        resolve(row.id_supervisor);
      });
    });
  };

//==================================Set==================================

//==================================Delete==================================

//==================================Support==================================

//translate a teacher into a supervisor
exports.fromTeacherToCoSupervisor= (teacher)=>{
    return {email:teacher.email, name:teacher.name, surname:teacher.surname, company:"PoliTo"};
}

