"use strict";

let db = require("./db");

/**
 * create a new object that represent thesis 
 * @returns 
 */
function newThesis(id, title, supervisor,CoSupervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status){
  return{
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
}

//==================================Create==================================

/**
 * add a new thesis
 * @returns SUCCESS: the new entry with the new ID is returned
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.addThesis = (title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status) => {
  if (!(title && supervisor && keywords && type && groups && description && knowledge && note && expiration_date && level && cds && creation_date && status)) {
    throw new Error('All parameters must be provided');
  }

  const sql = 'INSERT INTO Thesis(title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.run(sql, [title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status], function(err) {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      resolve(newThesis(this.lastID, title, supervisor,[], keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status));
    });
  });
};
//==================================Get==================================

/**
 * Return the thesis with the specificated ID
 * @param {*} id_thesis 
 * @returns an object that represent thesis or undefined if id does not exist
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.getById = (idThesis) => {
  if (idThesis==undefined || idThesis < 0) {
    throw new Error('Thesis ID must be greater than or equal to 0');
  }

  const fetchThesisByIdSQL = 'SELECT * FROM Thesis WHERE id = ?';

  return new Promise((resolve, reject) => {
    db.get(fetchThesisByIdSQL, [idThesis], (err, result) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      resolve(result);
    });
  });
};

/**
 * Find all the active thesis of onw specific supervisor 
 * @param {*} supervisorId, id of that specific supervisor 
 * @returns a list of thesis object
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.getActiveBySupervisor = (supervisorId, queryParam) => {
  
  if (supervisorId == undefined || supervisorId < 0) {
    throw new Error('Supervisor ID must be greater than or equal to 0 or Status must be 0 or 1');
  }

  const fetchActiveThesesBySupervisorSQL = 'SELECT * FROM Thesis WHERE status = ? AND supervisor = ?';
  return new Promise((resolve, reject) => {
    db.all(fetchActiveThesesBySupervisorSQL, [queryParam, supervisorId], (err, rows) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      if (rows.length === 0) {
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
};

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

exports.advancedResearch = (from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level, status) => {
  if (from == undefined || to == undefined || specific == undefined) {
    throw new Error('"from", "to", "order" and "specific" parameters must be defined');
  }
  let sql = sqlQueryCreator(from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level, status);
  const params = sql[1];
  sql = sql[0];
  
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      const res = rows.map((e) => newThesis(e.id, e.title, e.supervisor, [], e.keywords, e.type, e.groups, e.description, e.knowledge, e.note, e.expiration_date, e.level, e.cds, e.creation_date, e.status));
      resolve(res);
    });
  });
};

/**
 * Find the thesisId given the CoSupervisor id
 * @param {*} id: id of the co-supervisor
 * @returns [id1, id2, ....]
 */
exports.getIdByCoSupervisorId = (id) => {
  if (id==undefined || id < 0) {
    throw new Error('Co-supervisor ID must be greater than or equal to 0');
  }

  let thesisIds = [];
  const fetchThesisIdsByCoSupervisorIdSQL = 'SELECT id_thesis FROM CoSupervisorThesis WHERE id_cosupervisor = ?';

  return new Promise((resolve, reject) => {
    db.all(fetchThesisIdsByCoSupervisorIdSQL, [id], (err, rows) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      rows.forEach((e) => thesisIds.push(e.id_thesis));
      resolve(thesisIds);
    });
  });
};

//==================================Set==================================
/**
 * Update thesis with the same id with new parameters 
 * @param {*} id integer > 0
 * @param {*} title string
 * @param {*} supervisorId integer > 0
 * @param {*} keywords string
 * @param {*} type string
 * @param {*} groups string
 * @param {*} description string
 * @param {*} knowledge string
 * @param {*} note string
 * @param {*} expiration_date string 
 * @param {*} level 0 (bachelor) | 1 (master)
 * @param {*} cds string
 * @param {*} creation_date string
 * @param {*} status 0 | 1 (published)
 * @returns the number of row modified, if different from 1 it is an error
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.updateThesis = (id, title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status) => {
  if (id==undefined || title ==undefined || supervisor ==undefined || keywords ==undefined || type ==undefined || groups ==undefined || description ==undefined || knowledge ==undefined || note ==undefined || expiration_date ==undefined || level==undefined || cds ==undefined || creation_date ==undefined || status==undefined) {
    throw new Error('All parameters must be provided');
  }
  const updateThesisSQL = `UPDATE Thesis SET title = ?, supervisor = ?, keywords = ?, type = ?, groups = ?, description = ?, knowledge = ?, note = ?, expiration_date = ?, level = ?, cds = ?, creation_date = ?, status = ? WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(updateThesisSQL, [title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status, id], function(err) {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      if (this.changes === 0) {
        reject(new Error('No rows updated. Thesis ID not found.'));
        return;
      }
      resolve(this.changes);
    });
  });
};
/**
 * Update the status of the thesis with the same id
 * @param {*} id integer > 0
 * @param {*} status 0 | 1 (published)
 * @returns the number of row modified, if different from 1 it is an error
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.setStatus = (id, status) => {
  if (id == undefined || id < 0 || status == undefined || (status < 0 || status > 2)) {
    throw new Error('"id" must be greater than or equal to 0 and "status" must be 0 or 1 or 2');
  }
  let updateThesisSQL;
  //if new status is cancelled, 2, one check is added to see if thesis is also published 
  if(status==2)
    updateThesisSQL = 'UPDATE Thesis SET status = ? WHERE id = ? AND status = 1';
  else
    updateThesisSQL = 'UPDATE Thesis SET status = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.run(updateThesisSQL, [status, id], function (err) {
      if (err) {
        reject(new Error(err.message));
        return;
      }
      if (this.changes === 0) {
        reject(new Error('No rows updated. Thesis ID not found.'));
        return;
      }

      resolve(this.changes);
    });
  });
};

//==================================Delete==================================

//==================================Support==================================

/**
 * @returns SUCCESS: object defined as {nPage: 1}
 * @returns ERROR: sqlite error is returned in the form {error: "message"}
 */
exports.numberOfPage = (specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level, status) => {
  let sql = sqlQueryCreator(undefined, undefined, 'titleD', specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level, status);

  const params = sql[1];
  sql = sql[0];
  sql = sql.slice(8);

  sql = `SELECT COUNT(*) AS cnt${sql}`;
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(new Error(err.message));
        return;
      }

      resolve({ nRows: rows[0] ? rows[0].cnt : 0 });
    });
  });
};

//Only for advancedSearch
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

/**
 * Only for advancedSearch
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
function sqlQueryCreator(from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level, status) {
  let sql = "SELECT * FROM Thesis WHERE 1=1 ";
  let params = [];
  //specific = !specific;
  
  let input = {from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level, status};
  
  const op = specific ? '=' : 'LIKE';
  const conditions = [
    { name: 'title', column: 'title', operator: op },
    { name: 'idSupervisors', column: 'supervisor', operator: '=' },
    { name: 'idCoSupervisorsThesis', column: 'id', operator: '=' },
    { name: 'keyword', column: 'keywords', operator: op },
    { name: 'type', column: 'type', operator: op },
    { name: 'groups', column: 'groups', operator: op },
    { name: 'knowledge', column: 'knowledge', operator: op },
    { name: 'expiration_date', column: 'expiration_date', operator: specific ? '=':'<=' },
    { name: 'cds', column: 'cds', operator: 'LIKE' },
    { name: 'creation_date', column: 'creation_date', operator: specific ? '=':'>=' },
    { name: 'status', column: 'status', operator: '=' },
    { name: 'level', column: 'level', operator: '=' },
  ];
  const cb = (arg, cnd)=>{return cnd == '=' || cnd == '<=' || cnd == '>=' ? arg : `%${arg}%` }
  conditions.forEach((condition) => {
    const value = input[condition.name];
    if (value != null) {
      if (Array.isArray(value) && value.length>0) {
        sql += 'AND ('+condition.column+" "+condition.operator+"? ";
        params.push(cb(value[0], condition.operator));
        value.slice(1).forEach((item) => {
          sql += `OR ${condition.column} ${condition.operator} ? `;
          params.push(cb(item, condition.operator));
        });
        sql+=") ";
      } else {
        sql += `AND ${condition.column} ${condition.operator} ? `;
        params.push(cb(value, condition.operator));
      }
    }
  });


  sql += "ORDER BY " + transformOrder(order);
  if (to !== undefined && from !== undefined) sql += ` LIMIT ${to - from} OFFSET ${from}`;
  return [sql, params];
}

//==================================Virtual CLock==================================

const applicationRepository = require('./ApplicationRepository.js');
const { query } = require("express");
const { parse } = require("dotenv");
/**
 * Designed for Virtual clock
 * @param {*} date 
 */
exports.selectExpiredAccordingToDate = (date) => {
  if(date == undefined) {
    throw new Error('date is missing');
  }
  const sql = 'SELECT id FROM Thesis WHERE expiration_date <= ? AND status = 1'

  return new Promise( (resolve, reject) => {
    db.all(sql, [date], (err, rows) => {
      if(err)
        return reject(new Error(err.message));
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
  if(date == undefined) {
    throw new Error('date is missing');
  }
  const sql = 'SELECT id FROM Thesis WHERE expiration_date > ? AND expiration_date != 0 AND status = 0'

  return new Promise( (resolve, reject) => {
    db.all(sql, [date], (err, rows) => {
      if(err)
        return reject(new Error(err.message));
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
  if(ids == undefined) {
    throw new Error('date is missing');
  }
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Thesis SET status = 0 WHERE id IN (${placeholders})`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
      return reject(new Error(err.message));
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
  if(ids == undefined) {
    throw new Error('date is missing');
  }
  const placeholders = ids.map(() => '?').join(',');
  const sql = `UPDATE Thesis SET status = 1 WHERE id IN (${placeholders})`

  return new Promise( (resolve, reject) => {
    db.run(sql, ids, (err) => {
      if(err)
        return reject(new Error(err.message));
      else {
        applicationRepository.setPendingAccordingToThesis(ids)
          .then( resolve(true) )
          .catch( err => reject(err) )
      }
    })
  })
}

if(process.env.test){
  module.exports.db = db;
  module.exports.setdb = (a)=>{db = a};
  module.exports.restoredb = ()=>{db = require("./db")}
}