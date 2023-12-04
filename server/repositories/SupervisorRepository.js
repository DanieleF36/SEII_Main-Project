'use strict';

const sqlite = require('sqlite3');

//==================================Support==================================

const db = require('./db')
/**
 * Support function to retrive the supervisorId given the thesisId
 * @param {*} thesisId
 * @returns supervisorId : integer
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns "Not found" : if there is no match
 */
exports.getSupervisorIdByThesisId = (thesisId) => {
    const getSupervisorSql = 'SELECT supervisor FROM Thesis WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.get(getSupervisorSql, [thesisId], (err, result) => {
            if (err) {
                return reject({ error: err.message });
            }
            resolve(result.supervisor);
        });
    })
}