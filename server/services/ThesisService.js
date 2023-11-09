'use strict';

const thesisRepository = require("../repositories/ThesisRepository");
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
const coSupervisorThesisRepository = require("../repositories/CoSupervisorThesisRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const nItem=10;//number of item per page
/**
 * Return a list of thesis that respect all the parameters
 *
 * page Integer //Si parte dalla pagina 1
 * title String  (optional)
 * supervisor String, name defined as: name, surname (optional)
 * coSupervisor Listn, ame defined as: name, surname  (optional)
 * keyword String  (optional)
 * type String  (optional)
 * groups String  (optional)
 * knowledge String  (optional)
 * expiration_date String  (optional)
 * cds String  (optional)
 * creation_date String  (optional)
 * returns thesis
 **/
exports.advancedResearchThesis = async function(page,order,title,supervisor,coSupervisor,keyword,type,groups,knowledge,expiration_date,cds,creation_date) {
    //console.log("dentro thesis services");
    //If we don't find any supervisor or cosupervisors the research can stop
    let ok=!(supervisor || coSupervisor);
    //find information about id of theacer 
    let idSupervisors = null;
    if(supervisor != null){
        const ns = supervisor.split(" ");
        idSupervisors = await teacherRepository.findByNSorS(ns[0], ns[1]);
        if(idSupervisors!=null && idSupervisors.length>0)
            ok=true;
    }
    //console.log("info abaut teacher "+JSON.stringify(idSupervisors));
    //find information about id of coSupervisor 
    let idCoSupervisorsThesis = [];
    if(coSupervisor != null){
        for (let i = 0; i < coSupervisor.length; i++) {
            const e = coSupervisor[i];
            const ns = e.split(" ");
            let idsCo = await coSupervisorRepository.findByNSorS(ns[0], ns[1]);
            if (idsCo > 0)
              // Trova tutti gli ID delle tesi con co-supervisore che ha ID = idsCo
              idCoSupervisorsThesis.push(await coSupervisorThesisRepository.findThesisByCoSupervisorId(idsCo));
            if (idCoSupervisorsThesis.length > 0) 
              ok = true;
          }          
    }   
    //console.log("info about cosupervisor");
    //Check if has sense make others queries
    if(!ok)
       return [{}];
    //find all thesis
    let res = await thesisRepository.advancedResearch(nItem*(page-1),nItem*page,order,false, title,idSupervisors,idCoSupervisorsThesis,keyword,type,groups,knowledge,expiration_date,cds,creation_date, 1);
    //find information about teacher
    
    for(let i=0;i<res.length;i++){
        const t = await teacherRepository.findById(res[i].supervisor);
        res[i].supervisor=t;
    }
    //console.log("info about supervisor "+JSON.stringify(res));
    //find ids about co-supervisors
    for(let i=0;i<res.length;i++){
        const idList = await coSupervisorThesisRepository.findCoSupervisorIdsByThesisId(res[i].id);
        res[i].coSupervisor=[];
        for(let j=0;j<idList.length;j++){
            if(id.idTeacher!=null){
                const t = await teacherRepository.findById(id.idTeacher);
                res[i].coSupervisors.push(teacherRepository.fromTeacherToCoSupervisor(t));
            }
            else{
                res[i].coSupervisors.push(await coSupervisorRepository.findById(id.idCoSupervisor));
            }
        }
    }
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

