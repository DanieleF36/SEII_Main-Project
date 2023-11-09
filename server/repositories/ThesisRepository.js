'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});
//specific = true if your research is for something that is exactily like your params
exports.advancedResearch = (from, to, order, specific, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date,level)=>{
    let sql = "SELECT * FROM Thesis WHERE status=0 AND level="+level+" ";
    let params = [];
    specific = !specific;
    if (title != null) {
      sql += 'AND title ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${title}%` : title);
    }
    if (idSupervisors != null && idSupervisors.length > 0) {
      sql += 'AND (supervisor ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${idSupervisors[0].id}%` : idSupervisors[0].id);
      idSupervisors.slice(1).forEach((e) => {
        sql += 'OR supervisor ';
        sql+=specific ? 'LIKE ?' : '= ?';
        params.push(specific ? `%${e.id}%` : e.id);
      });
      sql += ') ';
    }
    
    if (idCoSupervisorsThesis != null && idCoSupervisorsThesis.length > 0) {
      sql += 'AND (id ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${idCoSupervisorsThesis[0]}%` : idCoSupervisorsThesis[0]);
      idCoSupervisorsThesis.slice(1).forEach((e) => {
        sql += 'OR id ';
        sql+=specific ? 'LIKE ?' : '= ?';
        params.push(specific ? `%${e.id}%` : e.id);
      });
      sql += ') ';
    }
    
    if (keyword != null) {
      sql += 'AND keywords ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${keyword}%` : keyword);
    }
    if (type != null) {
      sql += 'AND type ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${type}%` : type);
    }
    if (groups != null) {
      sql += 'AND groups ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${groups}%` : groups);
    }
    if (knowledge != null) {
      sql += 'AND knowledge ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${knowledge}%` : knowledge);
    }
    if (expiration_date != null) {
      sql += 'AND expiration_date ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${expiration_date}%` : expiration_date);
    }
    if (cds != null) {
      sql += 'AND cds ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${cds}%` : cds);
    }
    if (creation_date != null) {
      sql += 'AND creation_date ';
      sql+=specific ? 'LIKE ?' : '= ?';
      params.push(specific ? `%${creation_date}%` : creation_date);
    }
    sql+="ORDER BY "+transformOrder(order);
    sql+="LIMIT "+(to-from)+" OFFSET "+from;
   return new Promise((resolve, reject)=>{
        db.all(sql, params, (err, rows)=>{
            if (err) {
                console.log("errore "+err);
                reject(err);
                return;
            }
            const res = rows.map((e)=>({
                id: e.id,
                title: e.title,
                supervisor: e.supervisor,
                coSupervisors: null,
                keyword: e.keyword,
                type: e.type,
                groups: e.groups,
                knowledge: e.knowledge,
                expiration_date: e.expiration_date,
                cds: e.cds,
                creation_date: e.creation_date
            }));
        resolve(res);
        });
    });
}
//Trasform order and make it suitable for an SQL query
function transformOrder(order){
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
          return "keyword DESC ";
        case "keywordA":
          return "keyword ASC ";
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