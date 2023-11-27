'use strict';

const db = require("./db");


/**
 * Performs queries to the database for retriving all the info about the applications and linked thesis and supervisor made by a student
 * 
 * @param {*} id_student 
 * @returns an array of objects defined as
 * {
 *  title: string,
 *  supervisor_name: string,
 *  supervisor_surname: string,
 *  keywords: array of string,
 *  type: array of string,
 *  groups: array of string,
 *  description: string,
 *  knowledge: array of string,
 *  note: string,
 *  expiration_date: string,
 *  level: integer,
 *  cds: array of string,
 *  application_data: string,
 *  path_cv: string,
 *  status: integer,(this is application status) 
 * }
 */

exports.browserApplicationStudent = (id_student) => {
  const sqlApplication = `
      SELECT T.title, P.name AS supervisor_name, P.surname AS supervisor_surname, innerTable.status, T.type, T.groups, T.description, T.knowledge, T.note, T.level, T.expiration_date, T.cds, T.keywords, innerTable.path_cv, innerTable.data AS application_data
      FROM (SELECT id_student, path_cv, status, id_thesis, data, id_teacher 
            FROM Application 
            WHERE id_student = ?) AS innerTable
      JOIN Thesis AS T ON T.id = innerTable.id_thesis
      JOIN Student AS S ON S.id = innerTable.id_student
      JOIN Teacher AS P ON P.id = innerTable.id_teacher;
  `;
  return new Promise((resolve, reject) => {
    db.all(sqlApplication, [id_student], (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        const applications = rows.map((a) => ({
          title: a.title,
          supervisor_name: a.supervisor_name,
          supervisor_surname: a.supervisor_surname,
          status: a.status,
          type: a.type,
          groups: a.groups,
          description: a.description,
          knowledge: a.knowledge,
          note: a.note,
          level: a.level,
          keywords: a.keywords,
          expiration_date: a.expiration_date,
          cds: a.cds,
          path_cv: a.path_cv,
          application_data: a.application_data,
        }));
        resolve(applications);
      }
    });
  });
};

exports.findByEmail = (email) => {
  const sqlCoSupervisor = "SELECT * FROM Student WHERE email = ?";

  return new Promise((resolve, reject)=>{
      db.get(sqlCoSupervisor, [email], (err, row)=>{
          if (err) {
              reject(err);
              return;
          }
          if(!row) 
              resolve({})
          else 
              resolve({id:row.id, name:row.name, surname:row.surname, email:row.email, gender:row.gender, nationality:row.nationality, cod_degree:row.cod_degree, enrol_year:enrol_year});

      });
  });
}

exports.getStudentEmail = (id_student) => {
  const studentMailSQl = 'SELECT email FROM Student WHERE id = ? '
  return new Promise((resolve, reject) => {
    db.get(studentMailSQl, [id_student], function (err, result) {
      if (err) {
        console.error("Error in SQLDatabase:", err.message);
        reject(err);
      } else {
        resolve(result.email);
      }
    });
  });
};

exports.getStudentEmailCancelled = (id_student) => {
  const studentMailCancelledSQL = 'SELECT email FROM Student WHERE id != ? '
  return new Promise((resolve, reject) => {
    db.all(studentMailCancelledSQL, [id_student], function (err, result) {
      if (err) {
        console.error("Error in SQLDatabase:", err.message);
        reject(err);
      } else {
        const emails = result.map((row) => row.email);
        resolve(emails);
      }
    });
  });
};

exports.getStudentAndCDSByEmail= (email) => {
  const sqlCoSupervisor = "SELECT S.id, S.name, S.surname, S.email, S.gender, S.nationality, D.title, S.enrol_year  FROM Student S, Degree D WHERE S.cod_degree=D.cod AND S.email = ?";

  return new Promise((resolve, reject)=>{
      db.get(sqlCoSupervisor, [email], (err, row)=>{
          if (err) {
              reject(err);
              return;
          }
          if(!row) 
            resolve({})
          else {
            console.log(row)
            resolve({id:row.id, name:row.name, surname:row.surname, email:row.email, gender:row.gender, nationality:row.nationality, cds:row.title, enrol_year:enrol_year});
          }

      });
  })
}