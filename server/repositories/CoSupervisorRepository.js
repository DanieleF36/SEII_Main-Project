'use strict';

const db = require("./db");

//==================================Create==================================

//==================================Get==================================

/**
 * Returns a CoSupervisor given his id
 * @param {*} id: coSupervisor id 
 * @returns Object: {name: string, surname: string, email: string, company: string}
 */
exports.getById = (id) => {
  if(!id || id<0)
        throw {error: "id must be greather than 0"}
  const sqlCoSupervisor = "SELECT name, surname, email, company FROM CoSupervisor WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(sqlCoSupervisor, [id], (err, row) => {
      if (err) {
        return reject({error: err.message});
      }
      if (!row)
        resolve({})
      else
        resolve(row);

    });
  });
}

/**
 * Returns all CoSupervisor (one or more) given of a certain thesis id
 * @param {*} id : thesisId
 * @returns [{name: string, surname: string, email: string, company: string}, ...................]
 */
exports.getByThesisId = (id) => {
  if(!id || id<0)
        throw {error: "id must be greather than 0"}
  const sql = 'SELECT email FROM CoSupervisor WHERE id IN (SELECT id_cosupervisor AS List FROM CoSupervisorThesis WHERE id_thesis=?)'
  return new Promise( (resolve, reject) => {
    db.all(sql, [id], (err, rows) => {
      if (err) {
        return reject({error: err.message});
      }
      else if(rows.length == 0)
        resolve([])
      resolve(rows)
    })
  })
}

/**
 * Support function to retrive the info about a CoSupervisor having his email
 * @param email: Cosupervisor email
 * @returns object : {id : string, name : string, surname : string, email : string, company: string} 
 */
exports.getByEmail = (email) => {
  if(!email)
    throw {error: "email must exists"}
  const sqlCoSupervisor = "SELECT id, name, surname, email, company FROM CoSupervisor WHERE email = ?";
  return new Promise((resolve, reject) => {
    db.get(sqlCoSupervisor, [email], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (!row)
        resolve({})
      else
        resolve(row);

    });
  });
}

/**
 * Perfoms a search according to the following possible combinations:
 * 1. surname and name are defined, okay
 * 2. only surname is defined, okay
 * 3. only name is defined, error
 * 4. none of them are defined, error (never possible)
 * 
 * This will return a list of ids because more cosupervisor with same name/lastname pair could exist
 * 
 * @param {String} surname
 * @param {String} name 
 * @returns [id1, id2, ...]
 */
exports.getByNSorS = (surname, name) => {
  if(!surname || (!surname && name))
    throw {error: "surname must exists"}
  let sql = "SELECT id FROM CoSupervisor WHERE ";
  let params = [];
  if (name != null && surname != null) {
    sql += "name LIKE ? AND surname LIKE ?";
    params.push("%" + name + "%");
    params.push("%" + surname + "%");
  }
  else {
    sql += "surname LIKE ?";
    params.push("%" + surname + "%");
  }
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

//==================================Set==================================

//==================================Delete==================================

//==================================Support==================================

/**
 * Support function that retrive all the CoSupervisors email
 * @returns array of CoSupervisorsEmail (string)
 */
exports.getAllEmails = () => {
  return new Promise((resolve, reject) => {
    const coSupervisorSql = 'SELECT email FROM CoSupervisor';
    db.all(coSupervisorSql, [], (coSupervisorErr, coSupervisors) => {
      if (coSupervisorErr) {
        reject(coSupervisorErr);
        return;
      }
      if(coSupervisors.length === 0) {
        resolve([])
      }
      else {
        const coSupervisorEmails = coSupervisors.map((coSupervisor) => coSupervisor.email);
        resolve(coSupervisorEmails);
      }
    });
  });
}