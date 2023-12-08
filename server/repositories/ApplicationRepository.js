"use strict";

const dayjs = require('dayjs')

const db = require("./db");

//==================================Create==================================

/**
 * Performs the query to apply a student to a thesis having also the cv of the student 
 * @param {*} studentId 
 * @param {*} thesisId 
 * @param {*} cvPath 
 * @returns object = {applicationID : integer, studentId: integer,date : date, status: 0, professorId: integer}
 */
exports.addApplication = (studentId, thesisId, cvPath, supervisorId) => {
  if(!(studentId && thesisId && supervisorId) || studentId<0 || studentId<0 || supervisorId<0)
    return reject({error: "student and theis's id must exist and be greater than 0"});
  if(!path_cv)
    return reject({error: "path_cv must exists"});
  return new Promise((resolve, reject) => {
    //Create a current date to add at the new application 
    const currentDate = dayjs().format('YYYY-MM-DD').toString()
    const sql = 'INSERT INTO Application (id_student, id_thesis, data, path_cv, status, id_teacher) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [studentId, thesisId, currentDate, cvPath, 0, supervisorId], function (err) {
      if (err) {
        return reject(new Error(err.message));
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
};

//==================================Get==================================

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
exports.getByStudentId = (id_student) => {
  const sqlApplication = `
      SELECT innerTable.id_application, T.title, P.name AS supervisor_name, P.surname AS supervisor_surname, innerTable.status, T.type, T.groups, T.description, T.knowledge, T.note, T.level, T.expiration_date, T.cds, T.keywords, innerTable.path_cv, innerTable.data AS application_data
      FROM (SELECT A.id AS id_application, id_student, path_cv, status, id_thesis, data, id_teacher 
            FROM Application AS A
            WHERE id_student = ?) AS innerTable
      JOIN Thesis AS T ON T.id = innerTable.id_thesis
      JOIN Student AS S ON S.id = innerTable.id_student
      JOIN Teacher AS P ON P.id = innerTable.id_teacher;
  `;
  return new Promise((resolve, reject) => {
    db.all(sqlApplication, [id_student], (err, rows) => {
      if (err) {
        return reject(new Error(err.message));
      } else {
        const applications = rows.map((a) => ({
          id_application: a.id_application,
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

/**
 * Support function that retrive all the info about an application given his id 
 * @param {*} id: Application Id
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns object: {row : row of the application db} 
 */
exports.getById = (id) => {
  if(!id || id<0)
    throw {error: "id must exists and be greater than 0"};
  const fetchThesisStudentSQL = 'SELECT * FROM Application WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.get(fetchThesisStudentSQL, [id], (err, row) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve(row);
    });
  });
}

/**
 * Returns the "active" application of the student. Active = not rejected or cancelled
 * @param studentId
 * @returns objects that represents application if exisists, undefined otherwise
 * */
exports.getActiveByStudentId = (studentId) => {
  if(!studentId || studentId<0)
    throw {error: "studentId must exists and be greater than 0"};
  const sql = 'SELECT * FROM Application WHERE id_student = ? AND (status=1 OR status=0) ';
  return new Promise((resolve, reject)=>{
    db.get(sql, [studentId], (err, result) => {
      if (err) {
        return reject(new Error(err.message));
      }
      resolve(result);
    })
  })
}

/**
 * Performs queries to the database for retriving all the needed information given a supervisor's id
 * 
 * @param {*} id_teacher 
 * @returns an array of object 
 * { 
 * id_student: integer,
 * id_application: integer,
 * id_thesis: integer,
 * title: string,
 * name: string,
 * surname: string,
 * data: date,
 * path_cv: string,
 * status: integer
 * }
 */
exports.getByTeacherId = (id_teacher) => {
  const sqlApplication =
    "SELECT innerTable.id_thesis, innerTable.id, innerTable.id_student, title, S.name, S.surname, innerTable.data, innerTable.path_cv, innerTable.status FROM (SELECT id,id_student,path_cv,status,id_thesis,data FROM Application WHERE id_teacher=?) AS innerTable, Thesis AS T, Student AS S WHERE T.id = innerTable.id_thesis AND S.id = innerTable.id_student";
  return new Promise((resolve, reject) => {
    db.all(sqlApplication, [id_teacher], (err, rows) => {
      if (err) {
        return reject(new Error(err.message));
      }
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
    });
  });
};

//==================================Set==================================

/**
 * Support functions used to update the status of an application
 * @param {*} id: Application ID
 * @param {*} status: new status for the application 
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns "Done": the function is completed without problems 
 */
exports.updateStatus = (id, status)=>{
  if(!id || id<0)
    throw {error:"id must exists and be greater than 0"};
  if(status == undefined || status<0 || status>3)
    throw {error:"status must exists and be one or two or three"};
  const updateApplicationSQL = 'UPDATE Application SET status = ? WHERE id = ?';
  return new Promise((resolve, reject)=>{
    db.run(updateApplicationSQL, [status, id], function (err) {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve("Done")
    })
  })
}

/**
 * Support functions used to set the status of the application for a thesis of all the 
 * students to cancelled. Only the status of the student having a certain id (id_student)
 * is not updated
 * @param {*} id_thesis: Thesis Id
 * @param {*} id_student: The studentId of the student to be not updated 
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns "Done": the function is completed without problems 
 */
exports.updateStatusToCancelledForOtherStudent = (id_thesis, id_student) => {
  if (!id_thesis || id_thesis < 0)
    throw {error: "id_thesis must exists and be greater than 0"};
  if (!id_student || id_student < 0)
    throw {error: "id_student must exists and be greater than 0"};
  return new Promise((resolve, reject) => {
    const updateOtherApplicationsSQL = 'UPDATE Application SET status = 3 WHERE id_thesis = ? AND id_student != ?';
    db.run(updateOtherApplicationsSQL, [id_thesis, id_student], function (err) {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve("Done")
    })
  })
};

//==================================Virtual CLock==================================

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
