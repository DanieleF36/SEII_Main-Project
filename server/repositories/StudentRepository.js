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
  if (!(id && id >= 0)) {
    throw new Error('Student ID must be greater than or equal to 0');
  }

  const fetchStudentByIdSQL = 'SELECT * FROM Student WHERE id = ?';

  return new Promise((resolve, reject) => {
    db.get(fetchStudentByIdSQL, [id], (err, row) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      resolve(newStudent(row.id, row.name, row.surname, row.email, row.gender, row.nationality, row.cod_degree, row.enrol_year));
    });
  });
};

/**
 * Given a student's email, returns all the stored information
 * @param {*} email student's email
 * @returns all the student's information
 */
exports.getByEmail = (email) => {
  if (!email) {
    throw new Error('Email must be provided');
  }
  const fetchStudentByEmailSQL = 'SELECT * FROM Student WHERE email = ?';

  return new Promise((resolve, reject) => {
    db.get(fetchStudentByEmailSQL, [email], (err, row) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      if (!row) {
        resolve({});
      } else {
        resolve(newStudent(row.id, row.name, row.surname, row.email, row.gender, row.nationality, row.cod_degree, row.enrol_year));
      }
    });
  });
};

/**
 * Given an application's id and a thesis'id, returns the list of student emails whose application has been deleted 
 * i.e. all the student's application for that thesis with id != id_application
 * @param {*} id_application 
 * @param {*} id_thesis 
 * @returns [email1, email2, .....]
 */
exports.getStudentEmailCancelled = (id_application, id_thesis) => {
  if (!(id_application && id_application >= 0)) {
    throw new Error('Application ID must be greater than or equal to 0');
  }
  if (!(id_thesis && id_thesis >= 0)) {
    throw new Error('Thesis ID must be greater than or equal to 0');
  }

  const fetchStudentEmailsCancelledSQL = 'SELECT email FROM Student WHERE id IN (SELECT id_student FROM Application WHERE id_thesis=? AND id!=? )';

  return new Promise((resolve, reject) => {
    db.all(fetchStudentEmailsCancelledSQL, [id_thesis, id_application], (err, result) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      const emails = result.map((row) => row.email);
      resolve(emails);
    });
  });
};

/**
 * Given a student's email, returns all the stored information plus the cds of that student
 * @param {*} email student's email
 * @returns all the student's information
 */
exports.getStudentAndCDSByEmail = (email) => {
  if (!email) {
    throw new Error('Email must be provided');
  }

  const fetchStudentAndCDSByEmailSQL = 'SELECT S.id, S.name, S.surname, S.email, S.gender, S.nationality, D.title, D.code, S.enrol_year FROM Student S, Degree D WHERE S.cod_degree = D.id AND S.email = ?';

  return new Promise((resolve, reject) => {
    db.get(fetchStudentAndCDSByEmailSQL, [email], (err, row) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      if (!row) {
        resolve({});
      } else {
        resolve({
          id: row.id,
          name: row.name,
          surname: row.surname,
          email: row.email,
          gender: row.gender,
          nationality: row.nationality,
          cdsCode: row.code,
          cds: row.title,
          enrol_year: row.enrol_year,
        });
      }
    });
  });
};

/**
 * Function that retrieve the student career information
 * @param {*} id_student id of the student
 * @returns array of object {title : string, grade : integer}
 */
exports.getCareerByStudentId = async function (id_student) {
  const getCareerByStudentIdsql = 'SELECT title_course, grade FROM Career WHERE id = ?'
  console.log(id_student);
  return new Promise((resolve, reject) => {
    db.all(getCareerByStudentIdsql, [id_student], (err, result) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      const career = result.map((r) => ({ title_course: r.title_course, grade: r.grade }));
      resolve(career);
    });
  });
}

//==================================Set==================================

//==================================Delete==================================

//==================================Support==================================