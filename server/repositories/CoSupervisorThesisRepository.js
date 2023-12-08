'use strict';

const db = require('./db')


//==================================Create==================================

/**
 * Insert an entry into COSUPERVISORTHESIS table without performing any checks over parameters exis
 * @param {*} id_thesis must exists in THESIS 
 * @param {*} id_theacher must exists in TEACHER
 * @param {*} id_cosupervisor must exists in COSUPERVISOR
 * @returns true
 */
exports.addCoSupervisorThesis = (id_thesis, id_theacher, id_cosupervisor) => {
    if(id_thesis<0 || id_theacher<0 || id_cosupervisor<0)
        throw {error: "id must be greather than 0"}
    const sql = "INSERT INTO CoSupervisorThesis(id_thesis, id_teacher, id_cosupervisor) VALUES (?, ?, ?)"
    return new Promise((resolve, reject) => {
        db.run(sql, [id_thesis, id_theacher, id_cosupervisor], (err) => {
            if (err)
                return reject(new Error(err.message));
            resolve(true)
        })
    })
}

//==================================Get==================================

/**
 * Given a selected thesis the ids of the supervisor and cosupervisors will be returned
 * @param {*} id of a selected thesis 
 * @returns [{idTeacher: id}, {idCoSupervisor: id}, ...]
 */
exports.getIdsByThesisId = (id) => {
    if(!id || id<0)
        throw {error: "id must be greather than 0"}
    const sqlCoSupervisor = "SELECT id_teacher, id_cosupervisor FROM CoSupervisorThesis WHERE id_thesis = ?";
    return new Promise((resolve, reject) => {
        db.all(sqlCoSupervisor, [id], (err, rows) => {
            if (err) {
                reject(new Error(err.message));
                return;
            }
            const res = rows.map((e) => {
                if (e.id_teacher == 0 || e.id_teacher == null)
                    return { idCoSupervisor: e.id_cosupervisor };
                else if (e.id_cosupervisor == 0 || e.id_cosupervisor == null)
                    return { idTeacher: e.id_teacher };
            });
            resolve(res);
        });
    });
}

//==================================Set==================================

//==================================Delete==================================

/**
 * Delete coSupervisor given the thesis id
 * @param {*} thesisId 
 * @returns true: delete completed without error
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.removeCoSupervisorsByThesisId = (thesisId) => {
    if(!thesisId || thesisId<0)
        throw {error: "thesisId must be greather than 0"}
    const sql = 'DELETE FROM CoSupervisorThesis WHERE id_thesis = ?';
    return new Promise((resolve, reject) => {
        db.run(sql, [thesisId], function (err) {
            if (err) {
                return reject(new Error(err.message));
            }
            resolve(true);
        });
    });
};

//==================================Support==================================