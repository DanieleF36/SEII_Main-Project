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
 * @returns all the request's info or an empty object if the request has not been found
 */
exports.getRequest = function (request_id) {
    if (request_id < 0)
        throw new Error("Request must be positive")
    const sql = "SELECT * FROM Request WHERE id = ?"
    return new Promise((resolve, reject) => {
        db.get(sql, [request_id], function (err, row) {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            if (!row) {
                resolve({})
            }
            resolve(newRequest(row.studentId, row.supervisorId, row.description, row.statusS, row.statusT));
        })
    })
}

exports.getActiveByStudentId = (studentId) => {
    if (!(studentId && studentId >= 0)) {
        throw new Error('Student ID must be greater than or equal to 0');
    }
    const fetchActiveApplicationSQL = 'SELECT * FROM Request WHERE studentId = ? AND (statusS=1 OR statusS=0) AND (statusT=1 OR statusT=0 OR statusT=3)';
    return new Promise((resolve, reject) => {
        db.get(fetchActiveApplicationSQL, [studentId], (err, result) => {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(result);
        });
    });
};

//==================================Set==================================

/**
 * Support function to accept or reject a thesis request
 * @param {*} request_id 
 * @param {*} status : 0 reject, 1 accept
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 * @returns "Done": the function is completed without problems 
 */
exports.thesisRequestStatusUpdate = function (request_id, status) {
    if (request_id == undefined || status == undefined)
        throw new Error("Parameters are wrong")

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

exports.getRequestsByProfessor = function (professor_id) {
    if (professor_id == undefined)
        throw new Error("Parameter is wrong")

    const sql = "SELECT R.id, description, statusS, statusT, S.surname, S.name FROM Request R, Student S WHERE supervisorId = ? AND R.statusS = 1 AND R.studentId = S.id"
    return new Promise((resolve, reject) => {
        db.all(sql, [professor_id], (err, rows) => {

            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(rows);
        })
    })
}

exports.getRequestAll = function () {

    const sql = "SELECT R.id, description, supervisorId, studentId, statusS, statusT, S.surname AS studentSurname, S.name AS studentName, T.surname, T.name FROM Request R, Student S, Teacher T  WHERE studentId = S.id AND supervisorId = T.id"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(rows);
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
    if (status < 0 || status > 2) {
        throw new Error("Status must be between 1 and 3 inclusive");
    }

    const sql = "UPDATE Request SET statusT = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [status, request_id], function (err) {
            if (this.changes === 0) {
                reject(new Error('No rows updated. Request ID not found.'));
                return;
            }

            resolve(this.changes);
        });
    });
};

exports.getRequestByStudentId = function (studentId) {
    if (studentId < 0) {
        throw new Error("Student ID not valid")
    }
    const sql = "SELECT * FROM Request R WHERE R.studentId = ? AND (statusS = 0 OR (statusS=1 AND statusT=0) OR (statusS=1 AND statusT=1) OR (statusS=1 AND statusT=3)) "
    return new Promise((resolve, reject) => {
        db.get(sql, [studentId], (err, rows) => {

            if (err) {
                reject(new Error(err.message));
                return;
            }
            resolve(rows);
        })
    })
};
