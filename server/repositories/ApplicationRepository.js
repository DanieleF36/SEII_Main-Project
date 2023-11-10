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
