"use strict";

const db = require("./db");
const applicationRepository = require('./ApplicationRepository.js')

/**
 * Composes the query and performs an advanced search
 *
 * @param {*} from defines the index of 1st chosen entries (offset)
 * @param {*} to defines the index of last chosen entries (to-from = no_entries)
 * @param {*} order string with A(SC) or D(ESC) (ie titleD will became ORDER BY title DESC)
 * @param {*} specific true if your research is for something that is exactily like your params
 * @param {*} title string
 * @param {*} idSupervisors list of ids
 * @param {*} idCoSupervisorsThesis list of ids
 * @param {*} keyword Array of string
 * @param {*} type string
 * @param {*} groups Array of  string
 * @param {*} knowledge string
 * @param {*} expiration_date TOBE defined
 * @param {*} cds Array of string
 * @param {*} creation_date TOBE defined
 * @param {*} level 0 (bachelor) | 1 (master)
 * @returns list of thesis objects
 */

//Only for advancedSearch
function sqlQueryCreator(from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level) {
  let sql = "SELECT * FROM Thesis WHERE status=1 AND level=" + level + " ";
  let params = [];
  specific = !specific;
  // checks for title if exists
  if (title != null) {
    sql += "AND title ";
    sql += specific ? "LIKE ?" : "= ?";
    params.push(specific ? `%${title}%` : title);
  }
  // checks for supervisors ids if the array is defined
  if (idSupervisors != null && idSupervisors.length > 0) {
    sql += 'AND (supervisor ';
    sql+=specific ? 'LIKE ?' : '= ?';
    params.push(specific ? `%${idSupervisors[0].id}%` : idSupervisors[0].id);
    // adding to the query each id we got considering also homonyms, slice for skipping the first one (already handled)
    idSupervisors.slice(1).forEach((e) => {
      sql += "OR supervisor ";
      sql += specific ? "LIKE ?" : "= ?";
      params.push(specific ? `%${e.id}%` : e.id);
    });
    sql += ") ";
  }

  // checks for cosupervisors ids if the array is defined
  if (idCoSupervisorsThesis != null && idCoSupervisorsThesis.length > 0) {
    sql += "AND (id ";
    sql += "= ?";
    params.push(
      specific ? `%${idCoSupervisorsThesis[0]}%` : idCoSupervisorsThesis[0]
    );
    // adding to the query each id we got considering also homonyms, slice for skipping the first one (already handled)
    idCoSupervisorsThesis.slice(1).forEach((e) => {
      sql += "OR id ";
      sql += "= ?";
      params.push(specific ? `%${e.id}%` : e.id);
    });
    sql += ") ";
  }

  if (keyword != null) {
    sql += "AND keywords ";
    sql += specific ? "LIKE ?" : "= ?";
    let k = Array.isArray(keyword) ? "" : keyword;
    if (Array.isArray(keyword))
      keyword.forEach((e) => {
        k += e + ", ";
      });
    params.push(specific ? `%${k}%` : k);
  }
  if (type != null) {
    sql += "AND type ";
    sql += specific ? "LIKE ? " : "= ? ";
    let t = Array.isArray(type) ? "" : type;
    if (Array.isArray(type))
      type.forEach((e) => {
        t += e + ", ";
      });
    params.push(specific ? `%${t}%` : e);
  }
  if (groups != null) {
    sql += "AND groups ";
    sql += specific ? "LIKE ? " : "= ? ";
    let t = Array.isArray(groups) ? "" : groups;
    if (Array.isArray(groups))
      type.forEach((e) => {
        t += e + ", ";
      });
    params.push(specific ? `%${t}%` : e);
  }
  if (knowledge != null) {
    sql += "AND knowledge ";
    sql += specific ? "LIKE ?" : "= ?";
    params.push(specific ? `%${knowledge}%` : knowledge);
  }
  if (expiration_date != null) {
    sql += "AND expiration_date ";
    sql += specific ? "<= ? " : "= ? ";
    params.push(expiration_date);
  }
  if (cds != null) {
    sql += "AND cds ";
    sql += specific ? "LIKE ? " : "= ? ";
    let t = Array.isArray(cds) ? "" : cds;
    if (Array.isArray(cds))
      type.forEach((e) => {
        t += e + ", ";
      });
    params.push(specific ? `%${t}%` : e);
  }
  if (creation_date != null) {
    sql += "AND creation_date ";
    sql += specific ? ">= ? " : "= ? ";
    params.push(creation_date);
  }
  sql += "ORDER BY " + transformOrder(order);
  if (to != undefined && from != undefined) sql += " LIMIT " + (to - from) + " OFFSET " + from;
  return [sql, params];
}

/**
 * Composes the query and performs an advanced search
 *
 * @param {*} from defines the index of 1st chosen entries (offset)
 * @param {*} to defines the index of last chosen entries (to-from = no_entries)
 * @param {*} order string with A(SC) or D(ESC) (ie titleD will became ORDER BY title DESC)
 * @param {*} specific true if your research is for something that is exactily like your params
 * @param {*} title string
 * @param {*} idSupervisors list of ids
 * @param {*} idCoSupervisorsThesis list of ids
 * @param {*} keyword Array of String
 * @param {*} type string
 * @param {*} groups Array of String
 * @param {*} knowledge Array of String
 * @param {*} expiration_date string
 * @param {*} cds Array of String
 * @param {*} creation_date string
 * @param {*} level 0 (bachelor) | 1 (master)
 * @returns list of thesis objects
 */
exports.advancedResearch = (from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level) => {
  let sql = sqlQueryCreator(from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
  const params = sql[1];
  sql = sql[0];
  return new Promise((resolve, reject) => {
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const res = rows.map((e) => ({
        id: e.id,
        title: e.title,
        supervisor: e.supervisor,
        coSupervisors: [],
        keywords: e.keywords,
        type: e.type,
        note: e.note,
        level:e.level,
        groups: e.groups,
        knowledge: e.knowledge,
        expiration_date: e.expiration_date,
        cds: e.cds,
        creation_date: e.creation_date,
        status: e.status,
        description: e.description
      }));
      resolve(res);
    });
  });
};
/**
 * @returns SUCCESS: the new entry ID is returned
 * @returns ERROR: sqlite error is returned
 */
exports.numberOfPage = (specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level) => {
  let sql = sqlQueryCreator( undefined, undefined, "titleD", specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
  const params = sql[1];
  sql = sql[0];
  sql = sql.slice(8);
  sql = "SELECT COUNT(*) AS cnt"+sql;
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.log("errore " + err);
        reject(err);
        return;
      }
      resolve({ nRows: rows[0] ? rows[0].cnt : 0 });
    });
  });
};

/**
 * @returns SUCCESS: the new entry ID is returned
 * @returns ERROR: sqlite error is returned
 */
exports.addThesis = (
  title,
  supervisor,
  keywords,
  type,
  groups,
  description,
  knowledge,
  note,
  expiration_date,
  level,
  cds,
  creation_date,
  status
) => {
  const sql = `INSERT INTO Thesis(title, supervisor, keywords, type, groups, description, 
                                        knowledge, note, expiration_date, level, cds, creation_date, status)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [
        title,
        supervisor,
        keywords,
        type,
        groups,
        description,
        knowledge,
        note,
        expiration_date,
        level,
        cds,
        creation_date,
        status,
      ],
      function (err) {
        if (err) {
          console.error("SQLite Error:", err.message);
          reject(err);
          return;
        }
        const thesis_obj = {
          id: this.lastID,
          title: title,
          supervisor: supervisor,
          keywords: keywords,
          type: type,
          groups: groups,
          description: description,
          knowledge: knowledge,
          note: note,
          expiration_date: expiration_date,
          level: level,
          cds: cds,
          creation_date: creation_date,
          status: status,
        };
        resolve(thesis_obj);
      }
    );
  });
};

//Trasform order and make it suitable for an SQL query
function transformOrder(order) {
  switch (order) {
    case "titleD":
      return "title DESC ";
    case "titleA":
      return "title ASC ";
    case "supervisorD":
      return "supervisor DESC ";
    case "supervisorA":
      return "supervisor ASC ";
    case "co-supervisorD":
      return "co-supervisor DESC ";
    case "co-supervisorA":
      return "co-supervisor ASC ";
    case "keywordD":
      return "keywords DESC ";
    case "keywordA":
      return "keywords ASC ";
    case "typeD":
      return "type DESC ";
    case "typeA":
      return "type ASC ";
    case "groupsD":
      return "groups DESC ";
    case "groupsA":
      return "groups ASC ";
    case "knowledgeD":
      return "knowledge DESC ";
    case "knowledgeA":
      return "knowledge ASC ";
    case "expiration_dateD":
      return "expiration_date DESC ";
    case "expiration_dateA":
      return "expiration_date ASC ";
    case "cdsD":
      return "cds DESC ";
    case "cdsA":
      return "cds ASC ";
    case "creation_dateD":
      return "creation_date DESC ";
    case "creation_dateA":
      return "creation_date ASC ";
    default:
      return `Azione non valida per ${order}`;
  }
}

exports.getActiveThesis = (supervisor, date) => {
  const sql = `SELECT id, title, supervisor, keywords, type, groups, description,
                knowledge, note, expiration_date, level, cds, creation_date 
               FROM thesis 
               WHERE status = 1 AND expiration_date > ? AND supervisor = ?`
  
  return new Promise( (resolve, reject) => {
    db.all(sql, [date, supervisor], (err, rows) => {
      if(err) {
        reject(err)
      }
      else if(rows.length === 0) {
        resolve([])
      }
      else resolve(rows)
    })
  })
}

exports.updateThesis = (
  id,
  title,
  supervisor,
  keywords,
  type,
  groups,
  description,
  knowledge,
  note,
  expiration_date,
  level,
  cds,
  creation_date,
  status
) => {
  const sql = `UPDATE Thesis 
               SET title = ?, supervisor = ?, keywords = ?, type = ?, groups = ?, description = ?, 
                   knowledge = ?, note = ?, expiration_date = ?, level = ?, cds = ?, creation_date = ?, status = ?
               WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [
        title,
        supervisor,
        keywords,
        type,
        groups,
        description,
        knowledge,
        note,
        expiration_date,
        level,
        cds,
        creation_date,
        status,
        id,
      ],
      function (err) {
        if (err) {
          console.error("SQLite Error:", err.message);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject({ error: "No rows updated. Thesis ID not found." });
          return;
        }
        const updatedThesis = {
          id: id,
          title: title,
          supervisor: supervisor,
          keywords: keywords,
          type: type,
          groups: groups,
          description: description,
          knowledge: knowledge,
          note: note,
          expiration_date: expiration_date,
          level: level,
          cds: cds,
          creation_date: creation_date,
          status: status,
        };
        resolve(updatedThesis);
      }
    );
  });
};

exports.getCosupervisorByThesis = (id) => {
  const sql = 'SELECT email FROM CoSupervisor  WHERE id IN (SELECT id_cosupervisor AS List FROM CoSupervisorThesis WHERE id_thesis=?)'

  return new Promise( (resolve, reject) => {
    db.all(sql, [id], (err, rows) => {
      if(err)
        reject(err)
      else if(rows.length == 0)
        resolve([])
      resolve(rows.map(a => a.email))
    })
  })
}
/**
 * Designed for Virtual clock
 * @param {*} date 
 */
exports.selectExpiredAccordingToDate = (date) => {
  const sql = 'SELECT id FROM Thesis WHERE expiration_date <= ? AND status = 1'

  return new Promise( (resolve, reject) => {
    db.all(sql, [date], (err, rows) => {
      if(err)
        reject(err)
      else if(rows.length == 0)
        resolve([])
      resolve(rows.map(a => a.id))
    })
  })
}

/**
 * Designed for Virtual clock
 * @param {*} date 
 */
exports.selectRestoredExpiredAccordingToDate = (date) => {
  const sql = 'SELECT id FROM Thesis WHERE expiration_date > ? AND expiration_date != 0 AND status = 0'

  return new Promise( (resolve, reject) => {
    db.all(sql, [date], (err, rows) => {
      if(err)
        reject(err)
      else if(rows.length == 0)
        resolve([])
      resolve(rows.map(a => a.id))
    })
  })
}

/**
 * Designed for Virtual clock
 * @param {*} ids of updatable thesis 
 */
exports.setExpiredAccordingToIds = (ids) => {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Thesis SET status = 0 WHERE id IN (${placeholders})`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        reject(err)
      else {
        applicationRepository.setCancelledAccordingToThesis(ids)
          .then( resolve(true) )
          .catch( err => reject(err) )
      }
    })
  })
}

/**
 * Designed for Virtual clock
 * @param {*} ids of updatable thesis  
 */
exports.restoreExpiredAccordingToIds = (ids) => {
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Thesis SET status = 1 WHERE id IN (${placeholders})`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        reject(err)
      else {
        applicationRepository.setPendingAccordingToThesis(ids)
          .then( resolve(true) )
          .catch( err => reject(err) )
      }
    })
  })
}
