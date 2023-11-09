"use strict";

const sqlite = require("sqlite3");

const db = new sqlite.Database("db.sqlite", (err) => {
  if (err) throw err;
});

exports.listApplication = (id_teacher) => {
  const sqlTeacher = "SELECT * FROM Application WHERE id_teacher=?";
  return new Promise((resolve, reject) => {
    db.all(sqlTeacher, [id_teacher], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(rows);
      if (rows == []) {
        resolve({ error: "Application not found." });
      } else {
        const application = rows.map((a) => ({
          id_student: a.id_student,
          id_thesis: a.id_thesis,
          data: a.data,
          path_cv: a.path_cv,
          status: a.status,
          id_teacher: a.id_teacher,
        }));
        resolve(application);
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
      if (status == null) {
        resolve({ error: "Missing new status" });
      }
      if (id_teacher == null) {
        resolve({ error: "Teacher_id missing" });
      }
      if (id_application == null) {
        resolve({ error: "Application_id missing" });
      }
      resolve(this.changes);
    });
  });
};
