'use strict';
const db = require("./db");

function newStudent(id, name, surname, email, gender, nationality, cod_degree, enrol_year){
  return {
    id: id, 
    name:name,
    surname:surname, 
    email:email,
    gender:gender,
    nationality:nationality, 
    cod_degree:cod_degree,
    enrol_year:enrol_year
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
  if(!id || id<0)
    throw {error:"id must exists and be greater than 0"};
  const studentMailSQl = 'SELECT * FROM Student WHERE id = ? '
  return new Promise((resolve, reject) => {
    db.get(studentMailSQl, [id], function (err, row) {
      if (err) {
        reject({error: err.message});
      } else {
        resolve(newStudent(row.id, row.name, row.surname, row.email, row.gender, row.nationality, row.cod_degree, enrol_year));
      }
    });
  });
};

/**
 * Given a student's email, returns all the stored information
 * @param {*} email student's email
 * @returns all the student's information
 */
exports.getByEmail = (email) => {
  if(!email)
        throw {error:"email must exist"}
  const sqlCoSupervisor = "SELECT * FROM Student WHERE email = ?";
  return new Promise((resolve, reject)=>{
      db.get(sqlCoSupervisor, [email], (err, row)=>{
          if (err) {
            return reject({error: err.message});
          }
          if(!row) 
              resolve({})
          else 
              resolve(newStudent(row.id, row.name, row.surname, row.email, row.gender, row.nationality, row.cod_degree, enrol_year));

      });
  });
}

/**
 * Given an application's id and a thesis'id, returns the list of student emails whose application has been deleted 
 * i.e. all the student's application for that thesis with id != id_application
 * @param {*} id_application 
 * @param {*} id_thesis 
 * @returns [email1, email2, .....]
 */
exports.getStudentEmailCancelled = (id_application, id_thesis) => {
  if(!id_application || id_application<0)
    throw {error:"id_application must exists and be greater than 0"};
  if(!id_thesis || id_thesis<0)
    throw {error:"id_thesis must exists and be greater than 0"};
  const studentMailCancelledSQL = 'SELECT email FROM Student WHERE id IN (SELECT id_student FROM Application WHERE id_thesis=? AND id!=?) '
  return new Promise((resolve, reject) => {
    db.all(studentMailCancelledSQL, [id_thesis, id_application], function (err, result) {
      if (err) {
        reject({error: err.message});
      } else {
        const emails = result.map((row) => row.email);
        resolve(emails);
      }
    });
  });
};

/**
 * Given a student's email, returns all the stored information plus the cds of that student
 * @param {*} email student's email
 * @returns all the student's information
 */
exports.getStudentAndCDSByEmail= (email) => {
  if(!email)
    throw {error:"email must exist"}
  const sqlCoSupervisor = "SELECT S.id, S.name, S.surname, S.email, S.gender, S.nationality, D.title, S.enrol_year  FROM Student S, Degree D WHERE S.cod_degree=D.cod AND S.email = ?";
  return new Promise((resolve, reject)=>{
    db.get(sqlCoSupervisor, [email], (err, row)=>{
        if (err) {
            return reject({error: err.message});
        }
        if(!row) 
          resolve({})
        else {
          resolve({id:row.id, name:row.name, surname:row.surname, email:row.email, gender:row.gender, nationality:row.nationality, cds:row.title, enrol_year:row.enrol_year});
        }

    });
  })
}

//==================================Set==================================

//==================================Delete==================================

//==================================Support==================================