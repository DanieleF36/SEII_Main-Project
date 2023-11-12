"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("db.sqlite", (err) => {
  if (err) throw err;
});

exports.listApplication = (id_teacher) => {
  const sqlApplication =
    "SELECT id,id_student,path_cv,status,id_thesis,data FROM Application WHERE id_teacher=?";
  const sqlStudent = "SELECT surname,name,cod_degree FROM Student WHERE id=?";
  const sqlThesis = "SELECT title,cds FROM Thesis WHERE id=?";
  let student;
  return new Promise((resolve, reject) => {
    //! QUERY TO THE APPLICATION DATABASE
    db.all(sqlApplication, [id_teacher], (err, rows) => {
      if (err) {
        console.error("SQLite Error:", err.message);
        reject(err);
        return;
      }
      //! CHECK IF THE APPLICATION EXIST OR NOT
      if (rows.length == 0) {
        return resolve({ error: "Application not found." });
      } else {
        const application = rows.map((a) => ({
          id_application: a.id,
          id_student: a.id_student,
          id_thesis: a.id_thesis,
          data: a.data,
          path_cv: a.path_cv,
          status: a.status,
        }));
        application.forEach((element) => {
          //! QUERY TO THE STUDENT DATABASE
          db.all(sqlStudent, [element.id_student], (err, rows) => {
            if (err) {
              console.error("SQLite Error:", err.message);
              reject(err);
              return;
            }
            //! CHECK TO SEE IF STUDENT EXIST OR NOT
            if (rows.length == 0) {
              return resolve({ error: "Student not found." });
            } else {
              student = rows.map((s) => ({
                surname: s.surname,
                name: s.name,
              }));
            }
            db.all(sqlThesis, [element.id_thesis], (err, rows) => {
              if (err) {
                console.error("SQLite Error:", err.message);
                reject(err);
                return;
              }
              //! CHECK TO SEE IF THE THESIS EXIST OR NOT
              if (rows.length == 0) {
                return resolve({ error: "Thesis not found." });
              } else {
                const thesis = rows.map((t) => ({
                  title: t.title,
                  cds: t.cds,
                }));
                resolve({
                  thesis: thesis,
                  student: student,
                  application: application,
                });
              }
            });
          });
        });
      }
    });
  });
};

exports.accRefApplication = (status, id_teacher, id_application) => {
  console.log("APPLICATION");
  console.log(status, id_teacher, id_application);
  const sqlTeacher =
    "UPDATE Application SET status = ? WHERE id_teacher = ? AND id = ?";
  return new Promise((resolve, reject) => {
    db.run(sqlTeacher, [status, id_teacher, id_application], (err, row) => {
      if (err) {
        console.error("SQLite Error:", err.message);
        reject(err);
        return;
      }
      resolve(this.changes);
    });
  });
};

exports.applyForProposal = (studentId, thesisId, cvPath) => {
  console.log("applyForProposal REPO studentID = " + studentId);

  return new Promise((resolve, reject) => {
    // Fetch supervisor based on the given thesisId
    const getSupervisorSql = 'SELECT supervisor FROM Thesis WHERE id = ?';

    db.get(getSupervisorSql, [thesisId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      const supervisorId = result.supervisor;

      const currentDate = new Date().toISOString();
      const sql = 'INSERT INTO Application (id_student, id_thesis, data, path_cv, status, id_teacher) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(sql, [studentId, thesisId, currentDate, cvPath, 0, supervisorId], function (err) {
        if (err) {
          reject(err);
        } else {
          // Access the auto-generated ID if needed.
          const insertedId = this.lastID;
          resolve(insertedId);
        }
      });
    });
  });
};

exports.acceptApplication = (status, teacherID, applicationID,) => {
  console.log("accApplication REPO = " + status);
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Application SET status = ? WHERE id_teacher = ? AND id = ?';
    db.run(sql, [status, teacherID, applicationID], function (err) {
      if (err) {
        console.error("Error in SQLDatabase:", err.message);
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};