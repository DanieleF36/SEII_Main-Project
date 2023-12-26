'use strict';
const db = require("./db");

exports.addCoSupervisor = function(requestId, coSupervisorId, teacherId){
    if(requestId == undefined || requestId < 0)
        throw new Error("Request id must be defined and greater or equal to 0");
    if(coSupervisorId==undefined || coSupervisorId <0)
        throw new Error("coSupervisorId must be defined")
    if(teacherId == undefined || teacherId < 0)
        throw new Error("teacherId must be defined and greater or equal to 0");
    const sql = "INSERT INTO RequestCoSupervisor(requestId, coSupervisorId, teacherId) VALUE(?,?,?)"
    return new Promise((resolve, reject)=>{
        db.run(sql, [requestId, coSupervisorId, teacherId], (err)=>{
            if(err){
                reject(new Error(err.message));
                return;
            }
            resolve(this.lastID)
        })
    })
}