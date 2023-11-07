'use strict';

const thesisRepository = require("../repositories/ThesisRepository");
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
const coSupervisorThesisRepository = require("../repositories/CoSupervisorThesisRepository");
const teacherRepository = require("../repositories/TeacherRepository");

/**
 * Return a list of thesis that respect all the parameters
 *
 * page Integer
 * title String  (optional)
 * supervisor String  (optional)
 * coSupervisor List  (optional)
 * keyword String  (optional)
 * type String  (optional)
 * groups String  (optional)
 * knowledge String  (optional)
 * expiration_date String  (optional)
 * cds String  (optional)
 * creation_date String  (optional)
 * returns thesis
 **/
exports.advancedResearchThesis = async function(page,title,supervisor,coSupervisor,keyword,type,groups,knowledge,expiration_date,cds,creation_date) {
    console.log("dentro thesis services, page = "+page);
    //find information about id of theacer 
    if(supervisor != null){
        const ns = supervisor.split(" ");
        let idTeacher = await teacherRepository.findByNSorS(ns[0], ns[1]);
        sql+="AND supervisor = ?"
        params.push(idTeacher)
    }
    console.log("info abaut teacher");
    //find information about id of coSupervisor 
    if(coSupervisor != null){
        const ns = coSupervisor.split(" ");
        let idsCo = await coSupervisorRepository.findByNSorS(ns[0], ns[1]);
        
        //find all the ids of thesis with cosupervisor that has id = idsCo
        let idsThesis = coSupervisorThesisRepository.findThesisByCoSupervisorId(idsCo);            
        if(idsThesis.length>0){
            sql+="AND (id = ? OR ";
            params.push(+idsThesis[0]);
            idsThesis.shift().forEach((e)=>{
                sql+="id = ? OR "
                params.push(e.id);
            });
            sql+") ";
        }
    }   
    console.log("info about cosupervisor");
    //find all thesis
    let res = await thesisRepository.advancedResearch(0,0,title,supervisor,coSupervisor,keyword,type,groups,knowledge,expiration_date,cds,creation_date);
    console.log("all thesis res "+res);
    //find information about teacher
    res.forEach(async (e, index, v)=>{
        const t = await teacherRepository.findById(e.supervisor);
        v[index]=t;
    });
    console.log("info about supervisor");
    //find ids about co-supervisors
    res.forEach(async (e, index, v)=>{
        const idList = await coSupervisorThesisRepository.findCoSupervisorIdsByThesisId(e.id);
        v[index].coSupervisor=[];
        idList.forEach(async (id)=>{
            if(id.idTeacher!=null){
                const t = await teacherRepository.findById(id.idTeacher);
                v[index].coSupervisor.push(teacherRepository.fromTeacherToCoSupervisor(t));
            }
            else{
                v[index].coSupervisor.push(await coSupervisorRepository.findById(id.idCoSupervisor));
            }
        })
    });
    return res;
}


/**
 * A student send his/her application for thesis {id} and attach his cv as json
 *
 * id Integer 
 **/
exports.addApplication = function(id) {
  
}


/**
 * Add a thesis
 *
 * body Thesis
 * returns thesis
 **/
exports.addThesis = function(thesis) {
  
}

