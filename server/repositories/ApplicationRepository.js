"use strict";

const dayjs = require('dayjs')

const db = require("./db");
const transporter = require('../email/transporter')
const thesisRepo = require('./ThesisRepository');
const teacherRepo = require('./TeacherRepository');
const studentRepo = require('./StudentRepository');

/**
 * Performs queries to the database for retriving all the needed information given a supervisor's id
 * 
 * first applications are obtained throught id_teacher, then for each of them student's information are added (name and lastname) as well as thesis information (title and cds)
 * 
 * @param {*} id_teacher 
 * @returns object { application: application, thesis: thesis, student: student } defined in controller file
 */
exports.listApplication = (id_teacher) => {
  const sqlApplication =
    "SELECT innerTable.id_thesis, innerTable.id, innerTable.id_student, title, S.name, S.surname, innerTable.data, innerTable.path_cv, innerTable.status FROM (SELECT id,id_student,path_cv,status,id_thesis,data FROM Application WHERE id_teacher=?) AS innerTable, Thesis AS T, Student AS S WHERE T.id = innerTable.id_thesis AND S.id = innerTable.id_student";
  return new Promise((resolve, reject) => {
    //! QUERY TO THE APPLICATION DATABASE, asks for the whole set of applications given a supervisor's id
    db.all(sqlApplication, [id_teacher], (err, rows) => {
      if (err) {
        console.error("SQLite Error:", err.message);
        reject(err);
        return;
      }
      //! CHECK IF THE APPLICATION EXIST OR NOT
      if (rows.length == 0) {
         reject({ error: "Application not found." });
         return
      } else {
        const application = rows.map((a) => ({
          id_student: a.id_student,
          id_application: a.id,
          id_thesis: a.id_thesis,
          title: a.title,
          name: a.name,
          surname: a.surname,
          data: a.data,
          path_cv: a.path_cv,
          status: a.status
        }))
        resolve(application);
      }
    });
  });
};

exports.addProposal = (studentId, thesisId, cvPath) => {
  return new Promise((resolve, reject) => {
    // Fetch supervisor id based on the given thesisId
    const getSupervisorSql = 'SELECT supervisor FROM Thesis WHERE id = ?';

    db.get(getSupervisorSql, [thesisId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      if (!result.supervisor) {
        reject({error: "Not found"});
        return;
      }

      const supervisorId = result.supervisor;
      //Create a current date to add at the new application 
      const currentDate = dayjs().format('YYYY-MM-DD').toString()
      const sql = 'INSERT INTO Application (id_student, id_thesis, data, path_cv, status, id_teacher) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(sql, [studentId, thesisId, currentDate, cvPath, 0, supervisorId], function (err) {
        if (err) {
          reject(err);
        } else {
          // Access the auto-generated ID if needed.
          const insertedId = this.lastID;
          resolve({
            applicationID: insertedId,
            studentId: studentId,
            date: currentDate,
            status: 0,
            professorId: supervisorId
          });
        }
      });
    });
  });
};

exports.updateStatus = (id, status)=>{
  if(!id || id<0)
    throw new Error("id must exists and be greater than 0");
    if(status == undefined || status<0 || status>3)
    throw new Error("status must exists and be one or two or three");
  const updateApplicationSQL = 'UPDATE Application SET status = ? WHERE id = ?';
  return new Promise((resolve, reject)=>{
    db.run(updateApplicationSQL, [status, id], function (err) {
      if (err) {
        //console.error("Error in SQLDatabase:", err.message);
        reject({error: err.message});
        return;
      }
      resolve("Done")
    })
  })
}

exports.updateStatusToCancelledForOtherStudent = (id_thesis, id_student)=>{
  if(!id_thesis || id_thesis<0)
    throw new Error("id_thesis must exists and be greater than 0");
    if(!id_student || id_student<0)
    throw new Error("id_student must exists and be greater than 0");
  return new Promise((resolve, reject)=>{
    const updateOtherApplicationsSQL = 'UPDATE Application SET status = 3 WHERE id_thesis = ? AND id_student != ?';
    db.run(updateOtherApplicationsSQL, [id_thesis, id_student], function (err) {
      if (err) {
        //console.error("Error in SQLDatabase:", err.message);
        reject({error: err.message});
        return;
      }
      resolve("Done")
    })
  })
};

exports.getApplication = (id) => {
  if(!id || id<0)
    throw new Error("id must exists and be greater than 0");
  const fetchThesisStudentSQL = 'SELECT * FROM Application WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.get(fetchThesisStudentSQL, [id], (err, row) => {
      if (err) {
        //console.error("Error in SQLDatabase:", err.message);
        reject({error: err.message});
        return;
      }
      resolve(row);
    });
  });
}

/**
 * Designed for Virtual clock
 * @param {*} ids of updated thesis  
 */
exports.setCancelledAccordingToThesis = (ids) => {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Application SET status = 3 WHERE id_thesis IN (${placeholders}) AND status = 0`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        reject(err)
      resolve(true)
    })
  })
}

/**
 * Designed for Virtual clock
 * @param {*} ids of updated thesis  
 */
exports.setPendingAccordingToThesis = (ids) => {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Application SET status = 0 WHERE id_thesis IN (${placeholders}) AND status = 3`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        reject(err)
      resolve(true)
    })
  })
}
