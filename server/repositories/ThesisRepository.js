'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite', (err) => {
    if(err) throw err;
});

exports.advancedResearch = (from, to, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date)=>{
    console.log("dentro thesis repository");
    let sql = "SELECT * FROM Thesis WHERE 1=1 ";//1=1 to can add AND to each possible if
    let params = [];
    if(title != null){
        sql+="AND title=? ";
        params.push(title)
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
    console.log("Prima della promise sql="+sql+" params="+params);
    return new Promise((resolve, reject)=>{
        db.all(sql, params, (err, rows)=>{
            if (err) {
                console.log("erorre in thesis repositori all'esecuzione della query "+err)
                reject(err);
                return;
            }
            const res = rows.map((e)=>({
                id: e.id,
                title: e.title,
                supervisor: e.supervisor,
                coSupervisor: null,
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

/**
 * @returns SUCCESS: the new entry ID is returned
 * @returns ERROR: a -1 error code is returned
 */
exports.addThesis = (title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status) => {
    const sql = `INSERT INTO Thesis(title, supervisor, keywords, type, groups, description, 
                                        knowledge, note, expiration_date, level, cds, creation_date, status)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    return new Promise((resolve, reject)=>{
        db.run(sql, [title, supervisor, keywords, type, groups, description, knowledge, note, expiration_date, level, cds, creation_date, status], function(err) {
            if (err) {
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
                status: status
            }
            resolve(thesis_obj)
        })
    })
}
