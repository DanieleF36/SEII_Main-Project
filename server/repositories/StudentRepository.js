'use strict';

const db = require("./db");


/**
 * Performs queries to the database for retriving all the info about the application made by a student
 * 
 * @param {*} id_student 
 * @returns object {
          id_application: a.id_application,
          id_thesis: a.id_thesis,
          thesis_title: a.thesis_title,
          thesis_supervisor: a.thesis_supervisor,
          thesis_keywords: a.thesis_keywords,
          thesis_type: a.thesis_type,
          thesis_groups: a.thesis_groups,
          thesis_description: a.thesis_description,
          thesis_knowledge: a.thesis_knowledge,
          thesis_note: a.thesis_note,
          thesis_expiration_date: a.thesis_expiration_date,
          thesis_level: a.thesis_level,
          thesis_cds: a.thesis_cds,
          thesis_creation_date: a.thesis_creation_date,
          thesis_status: a.thesis_status,
          cosupervisor_name: a.cosupervisor_name,
          cosupervisor_surname: a.cosupervisor_surname,
          application_data: a.application_data,
          application_path_cv: a.application_path_cv,
          application_status: a.application_status,
        }
 */
exports.browserApplicationStudent = (id_student) => {
  const sqlApplication = `
      SELECT
      T.title,
      P.name AS supervisor_name,
      P.surname AS supervisor_surname,
      innerTable.status,
      T.type,
      T.groups,
      T.description,
      T.knowledge,
      T.note,
      T.level,
      T.expiration_date,
      T.cds,
      T.keywords,
      innerTable.path_cv,
      innerTable.data AS application_data
    FROM 
      (SELECT id_student, path_cv, status, id_thesis, data, id_teacher 
      FROM Application 
      WHERE id_student = ?) AS innerTable
    JOIN Thesis AS T ON T.id = innerTable.id_thesis
    JOIN Student AS S ON S.id = innerTable.id_student
    JOIN Teacher AS P ON P.id = innerTable.id_teacher;
  `;
  return new Promise((resolve, reject) => {
    db.all(sqlApplication, [id_student], (err, rows) => {
      if (err) {
        console.error("SQLite Error:", err.message);
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