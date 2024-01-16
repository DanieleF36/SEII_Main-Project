'use strict';
const db = require("./db");

function newSecretary(id, name, surname, email) {
  return {
    id: id,
    name: name,
    surname: surname,
    email: email,
  }
}

exports.getByEmail = (email) => {
    if (!email) {
      throw new Error('Email must be provided');
    }
    const fetchStudentByEmailSQL = 'SELECT * FROM Secretary WHERE email = ?';
  
    return new Promise((resolve, reject) => {
      db.get(fetchStudentByEmailSQL, [email], (err, row) => {
        if (err) {
          reject(new Error(err.message));
          return;
        }
  
        if (!row) {
          resolve({});
        } else {
          resolve(newSecretary(row.id, row.name, row.surname, row.email));
        }
      });
    });
  };