'use strict';
const db = require("./db");

exports.addRequest = function(request, studentId){
    if(request == undefined)
        throw new Error("Request must be defined")
    if(studentId==undefined || studentId<0)
        throw new Error("Student id must be defined and greater or equal to 0")
    const sql = "INSERT INTO Request(studentId, supervisorId, description, statusS, statusT) VALUES(?, ?, ?, 0, 0)"
    return new Promise((resolve, reject)=>{
        db.run(sql, [studentId, request.supervisor, request.description], function(err){
            if(err){
                reject(new Error(err.message));
                return;
            }
            resolve({id: this.lastID, ...request})
        })
    })
}