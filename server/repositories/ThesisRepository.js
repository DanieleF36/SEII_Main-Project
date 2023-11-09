'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});
//specific = true if your research is for something that is exactily like your params
exports.advancedResearch = (from, to, order, specific, title, idSupervisor, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date)=>{
    let sql = specific?"SELECT * FROM Thesis WHERE 1=1 ":"SELECT * FROM Thesis LIKE 1=1 ";//1=1 to can add AND to each possible if
    let params = [];
    if(title != null){
        sql+="AND title=? ";
        params.push(title)
    }
    if(idSupervisor!=null){
        sql+="AND supervisor = ?"
        params.push(idSupervisor)
    }
    if(idCoSupervisorsThesis!=null && idCoSupervisorsThesis.length>0){
        sql+="AND (id = ? OR ";
        params.push(idsThesis[0]);
        idCoSupervisorsThesis.shift().forEach((e)=>{
            sql+="id = ? OR "
            params.push(e.id);
        });
        sql+") ";
    }
    if(keyword != null){
        sql+="AND keywords=? ";
        params.push(keyword);
    }
    if(type != null){
        sql+="AND type=? ";
        params.push(type);
    }
    if(groups != null){
        sql+="AND type=? ";
        params.push(groups);
    }
    if(knowledge != null){
        sql+="AND knowledge=? ";
        params.push(knowledge);
    }
    if(expiration_date != null){
        sql+="AND expiration_date=? ";
        params.push(expiration_date);
    }
    if(cds != null){
        sql+="AND type=? ";
        params.push(cds);
    }
    if(creation_date != null){
        sql+="AND creation_date=? ";
        params.push(creation_date);
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
          return "title DESC";
        case "titleA":
          return "title ASC";
        case "supervisorD":
          return "supervisor DESC";
        case "supervisorA":
          return "supervisor ASC";
        case "co-supervisorD":
          return "co-supervisor DESC";
        case "co-supervisorA":
          return "co-supervisor ASC";
        case "keywordD":
          return "keyword DESC";
        case "keywordA":
          return "keyword ASC";
        case "typeD":
          return "type DESC";
        case "typeA":
          return "type ASC";
        case "groupsD":
          return "groups DESC";
        case "groupsA":
          return "groups ASC";
        case "knowledgeD":
          return "knowledge DESC";
        case "knowledgeA":
          return "knowledge ASC";
        case "expiration_dateD":
          return "expiration_date DESC";
        case "expiration_dateA":
          return "expiration_date ASC";
        case "cdsD":
          return "cds DESC";
        case "cdsA":
          return "cds ASC";
        case "creation_dateD":
          return "creation_date DESC";
        case "creation_dateA":
          return "creation_date ASC";
        default:
          return `Azione non valida per ${item}`;
      }
}