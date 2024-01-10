'use strict';
const db = require("./db");

function newRequest(studentId, supervisorId, description, statusS, statusT) {
    return {
        studentId: studentId,
        supervisorId: supervisorId,
        description: description,
        statusS: statusS,
        statusT: statusT,
    }
}

exports.addRequest = function (request, studentId) {
    if (request == undefined)
        throw new Error("Request must be defined")
    if (studentId == undefined || studentId < 0)
        throw new Error("Student id must be defined and greater or equal to 0")
    const sql = "INSERT INTO Request(studentId, supervisorId, description, statusS, statusT) VALUES(?, ?, ?, 0, 0)"
    return new Promise((resolve, reject) => {
        db.run(sql, [studentId, request.supervisor, request.description], function (err) {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve({ id: this.lastID, ...request })
        })
    })
}

//==================================Get==================================

/**
 * Given a request id retrive all the request info
 * @param {*} request_id 
 * @returns all the request's info
 */
exports.getRequest = function (request_id) {
    if (request_id < 0)
        throw new Error("Request must be positive")
    const sql = "SELECT * FROM Request WHERE id = ?"
    return new Promise((resolve, reject) => {
        db.run(sql, [request_id], function (err, row) {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(newRequest(row.studentId, row.supervisorId, row.description, row.statusStatus, row.statusT));
        })
    })
}

//==================================Set==================================

/**
 * Support function to accept or reject a thesis request
 * @param {*} request_id 
 * @param {*} status : 0 reject, 1 accept
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns "Done": the function is completed without problems 
 */
exports.thesisRequestStatusUpdate = function (request_id, status) {
    if (request_id < 0)
        throw new Error("Request must be positive")
    if (status < 0 || status > 1)
        throw new Error("Status must be 0 or 1")
    const sql = "UPDATE Request SET statusS = ? WHERE id = ?"
    return new Promise((resolve, reject) => {
        db.run(sql, [status, request_id], function (err) {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            if (this.changes === 0) {
                reject(new Error('No rows updated. Request ID not found.'));
                return;
            }
            resolve(this.changes);
        })
    })
}

/**
 * Repository function to update the status of a thesis request
 * @param {*} request_id 
 * @param {*} status : 0 reject, 1 accept
 * @returns {Promise<number>} The number of rows updated
 */
exports.profReqStatusUpdate = function (request_id, status) {
    if (request_id < 0) {
        throw new Error("Request must be positive");
    }
    if (status < 0 || status > 3) {
        throw new Error("Status must be between 1 and 3 inclusive");
    }

    const sql = "UPDATE Request SET statusT = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [status, request_id], function (err) {
            if (err) {
                reject(new Error(err.message));
                return;
            }

            if (this.changes === 0) {
                reject(new Error('No rows updated. Request ID not found.'));
                return;
            }

            resolve(this.changes);
        });
    });
};