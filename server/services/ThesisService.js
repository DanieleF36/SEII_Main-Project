"use strict";
const dayjs = require("dayjs");

const thesisRepository = require("../repositories/ThesisRepository");
const coSupervisorThesisRepository = require("../repositories/CoSupervisorThesisRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const nItem = 10; //number of item per page
const coSupervisorRepository = require('../repositories/CoSupervisorRepository');
const applicationRepository = require('../repositories/ApplicationRepository');
/**
 * Return a list of thesis that respect all the parameters including name, surname and company for co-supervisor and the whole structure of supervisor
 *
 * @param page Integer, first thesis at page 1
 * @param order string with A(SC) or D(ESC) (ie titleD will became ORDER BY title DESC)
 * @param title String  (optional)
 * @param supervisor String, name defined as: name, surname (optional)
 * @param coSupervisor List, name defined as: name, surname  (optional)
 * @param keyword Array of String  (optional)
 * @param type String  (optional)
 * @param groups Array of String  (optional)
 * @param knowledge Array of String  (optional)
 * @param expiration_date String  (optional)
 * @param cds Array of String  (optional)
 * @param creation_date String  (optional)
 * @returns thesis
 **/
exports.advancedResearchThesis = async function (page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level) {
  // If we don't find any supervisor or cosupervisors or any thesis linked to these the research can stop
  let ok = !(supervisor || coSupervisor);
  //find information about id of supervisor
  
  let idSupervisors = await exports.supervisorCheck(supervisor);
  if (idSupervisors != null && idSupervisors.length > 0)
    ok = true;
  // find information about id of coSupervisors 
  let idCoSupervisorsThesis = await exports.coSupervisorCheck(coSupervisor);
  // if no. idCoSupervisorsThesis.length > 0 some data have been found
  if (idCoSupervisorsThesis?.length > 0) ok = true;
    
  //idSupervisors: [id1, id2, ...] list of ids with common lastname/name pair
  //idCoSupervisorsThesis [idThesis1, idThesis2, ...] list of thesis ids managed by the cosupervisor
  //Check if has sense make others queries
  if (!ok)
    return [[], 0];
  //find all thesis
  let res = await thesisRepository.advancedResearch(nItem * (page - 1), nItem * page, order, false, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
  
  // res contains a list of thesis objects which are okay with given filters
  //find number of page
  let npage = await thesisRepository.numberOfPage(false, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, level);
  npage = Math.ceil(npage.nRows / nItem);
  //find information about teacher
  
  await exports.supervisorInfo(res);
  
  //find ids about co-supervisors
  await exports.coSupervisorInfo(res);
  //
  return [res, npage];
};

exports.supervisorCheck = async(supervisor)=>{
  if(!supervisor)
  return null;
  let idSupervisors;
  const ns = supervisor.split(" ");
    // ns[1] is going to be undefined in case we did not put a name

    // performs a search by name and/or lastname and returns an array of ids
    if (ns.length > 1)
      idSupervisors = (await teacherRepository.getByNSorS(ns[1], ns[0])).map(e => e.id);
    else
      idSupervisors = (await teacherRepository.getByNSorS(ns[0])).map(e => e.id);
    return idSupervisors
}

exports.coSupervisorCheck=async(coSupervisor)=>{
  let idCoSupervisorsThesis;
  if(coSupervisor){
    idCoSupervisorsThesis = [];
    for (let tmp of coSupervisor) {
      const ns = tmp.split(" ");
      let idsCo;
      if (ns.length > 1)
        idsCo = (await coSupervisorRepository.getByNSorS(ns[1], ns[0])).map(e=>e.id);
      else
        idsCo = (await coSupervisorRepository.getByNSorS(ns[0])).map(e=>e.id);
      if (idsCo.length > 0)
        // add the thesis managed by the chosen cosupervisor 
        idCoSupervisorsThesis.push(await thesisRepository.getIdByCoSupervisorId(idsCo));

}
  }
  return idCoSupervisorsThesis;
}

exports.supervisorInfo=async(res)=>{
  for (let info of res) {
    // get all the superior's information given an id
    const t = await teacherRepository.getById(info.supervisor);
    // add superior's information to each thesis
    info.supervisor = t;
  }
}

exports.coSupervisorInfo=async(res)=>{
  for (let ids of res) {
    const idList = await coSupervisorThesisRepository.getIdsByThesisId(ids.id);
    ids.coSupervisor = [];
    for (let tmp of idList) {
      if (tmp.idTeacher != null) {
        const t = await teacherRepository.getById(tmp.idTeacher);
        ids.coSupervisor.push(
          teacherRepository.fromTeacherToCoSupervisor(t)
        );
      } else {
        ids.coSupervisor.push(
          await coSupervisorRepository.getById(tmp.idCoSupervisor)
        );
      }
    }
  }
}

exports.getActiveBySupervisor = async function(supervisorId,queryParam){
  return await thesisRepository.getActiveBySupervisor(supervisorId, queryParam);
}

/**
 * ~ UPDATED 26 nov
 * Behaviour:
 * - if even ONLY 1 co-supervisor is not found (so no entry in COSUPERVISOR), 400 error is returned
 * - if the teacher is not found (so no entry in TEACHER), 400 is returned (teacher is taken from
 *    cosupervisors list and it's not the one who is creating the thesis)
 *
 * Add a thesis to the table defining each field as follow:
 *
 * @param {*} Thesis
 * - id: incremental primary key, not requested
 * - title: string
 * - supervisor: teacher's ID defined into "TEACHER" table
 * - co_supervisor: array of co_supervisors' ID, it could be also empty and added after the thesis creation
 *                  for each co_supervisors, there should be a new entry into "COSUPERVISOR"
 * - keywords: array of string (with format: "%s,%s,%s,...")
 * - type: array of string
 * - group: array of string
 * - description: string
 * - knowledge: array of string
 * - note: string
 * - expiration_date: string
 * - level: 0 (bachelor) | 1 (master)
 * - cds: string
 * - creation_date: current date query is performed here
 * - status: MUST BE 1
 *
 * Moreover a CoSupervisor-Teacher-Thesis entry is added into "COSUPERVISORTHESIS" table for each CoSupervisor
 *
 * @returns thesis obj
 *
 **/
exports.addThesis = async function (thesis) {

  let cosupervisor_ids = []
  let supervisor_ids = []

  // look for each co-supervisor id into COSUPERVISOR
  if (Array.isArray(thesis.cosupervisor) && thesis.cosupervisor[0].length !== 0) {
    for (let email of thesis.cosupervisor) {
      let tmp = await coSupervisorRepository.getByEmail(email);
      if (Object.keys(tmp).length === 0) {
        tmp = await teacherRepository.getByEmail(email);
        if (Object.keys(tmp).length === 0) {
          return {
            status: 400,
            error: `supervisor ${email} not found in COSUPERVISOR`,
          };
        }
        else supervisor_ids.push(tmp.id)
      }
      else cosupervisor_ids.push(tmp.id)
    }
  }

  const exp_date = dayjs(thesis.expiration_date, "MM-DD-YYYY")
  .format("YYYY-MM-DD")
  .toString();
  thesis.expiration_date = exp_date;
  const creat_date = dayjs().format("YYYY-MM-DD").toString();
  thesis.creation_date = creat_date;
  
  thesis.keywords = thesis.keywords.join()
  thesis.type = thesis.type.join()
  thesis.groups = thesis.groups.join()
  thesis.knowledge = thesis.knowledge.join()
  thesis.cds = thesis.cds.join()

  // add an entry into THESIS
  const thesis_res = await thesisRepository.addThesis(
    thesis.title,
    thesis.supervisor,
    thesis.keywords,
    thesis.type,
    thesis.groups,
    thesis.description,
    thesis.knowledge,
    thesis.note,
    thesis.expiration_date,
    thesis.level,
    thesis.cds,
    thesis.creation_date,
    thesis.status
    )
  if (thesis_res.error) {
    throw new Error(thesis_res.error);
  }
  
  let result
  if (cosupervisor_ids.length > 0) {
    for (let id of cosupervisor_ids) {
      result = await coSupervisorThesisRepository.addCoSupervisorThesis(thesis_res.id, null, id)
      if (result instanceof Error) {
        return result
      }
    }
  }
  if (supervisor_ids.length > 0) {
    for (let id of supervisor_ids) {
      result = await coSupervisorThesisRepository.addCoSupervisorThesis(thesis_res.id, id, null)
      if (result instanceof Error) 
        return result
  }
}
  
  return thesis;
};

exports.updateThesis = async function (thesis, thesis_id) {
  const exp_date = dayjs(thesis.expiration_date, 'MM-DD-YYYY')
    .format('YYYY-MM-DD')
    .toString();
  thesis.expiration_date = exp_date;

  thesis.keywords = thesis.keywords.join()
  thesis.type = thesis.type.join()
  thesis.groups = thesis.groups.join()
  thesis.knowledge = thesis.knowledge.join()
  thesis.cds = thesis.cds.join()
  // Update the entry in THESIS
  console.log(thesis)
  const updatedThesis = await thesisRepository.updateThesis(
    thesis_id,
    thesis.title,
    thesis.supervisor,
    thesis.keywords,
    thesis.type,
    thesis.groups,
    thesis.description,
    thesis.knowledge,
    thesis.note,
    thesis.expiration_date,
    thesis.level,
    thesis.cds,
    thesis.creation_date,
    thesis.status
  );
  return updatedThesis;
};

exports.delete = async function (id){
  const app = await applicationRepository.getAcceptedByThesisId(id);
  if(!app)
    throw new Error("You can't delete this thesis, an application is already accepted");
  await thesisRepository.setStatus(id, 2);
} 