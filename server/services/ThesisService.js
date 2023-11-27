"use strict";
const dayjs = require("dayjs");

const thesisRepository = require("../repositories/ThesisRepository");
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
const coSupervisorThesisRepository = require("../repositories/CoSupervisorThesisRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const nItem = 10; //number of item per page

/**
 * Return a list of thesis that respect all the parameters
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
exports.advancedResearchThesis = async function (page, order, title, supervisor, coSupervisor, keyword, type, groups, knowledge, expiration_date, cds, creation_date) {
  // If we don't find any supervisor or cosupervisors or any thesis linked to these the research can stop
  let ok = !(supervisor || coSupervisor);

  //find information about id of supervisor
  let idSupervisors = null;
  if (supervisor != null) {
    const ns = supervisor.split(" ");

    // ns[1] is going to be undefined in case we did not put a name

    // performs a search by name and/or lastname and returns an array of ids
    if (ns.length > 1)
      idSupervisors = await teacherRepository.findByNSorS(ns[1], ns[0]);
    else
      idSupervisors = await teacherRepository.findByNSorS(ns[0]);

    // if idSupervisors is defined we found a user(s) who is managing a thesis in our system
    if (idSupervisors != null && idSupervisors.length > 0)
      ok = true;
  }
  // find information about id of coSupervisors 
  let idCoSupervisorsThesis = [];
  if (coSupervisor != null) {
    for (let i = 0; i < coSupervisor.length; i++) {
      const e = coSupervisor[i];
      const ns = e.split(" ");
      let idsCo;
      if (ns.length > 1)
        idsCo = await coSupervisorRepository.findByNSorS(ns[1], ns[0]);
      else
        idsCo = await coSupervisorRepository.findByNSorS(ns[0]);
      if (idsCo > 0)
        // add the thesis managed by the chosen cosupervisor 
        idCoSupervisorsThesis.push(await coSupervisorThesisRepository.findThesisByCoSupervisorId(idsCo));

      // if no. idCoSupervisorsThesis.length > 0 some data have been found
      if (idCoSupervisorsThesis.length > 0) ok = true;
    }
  }

  //idSupervisors: [id1, id2, ...] list of ids with common lastname/name pair
  //idCoSupervisorsThesis [idThesis1, idThesis2, ...] list of thesis ids managed by the cosupervisor

  //Check if has sense make others queries
  if (!ok)
    return [[], 0];

  //find all thesis
  let res = await thesisRepository.advancedResearch(nItem * (page - 1), nItem * page, order, false, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, 1);
  // res contains a list of thesis objects which are okay with given filters

  //find number of page
  let npage = await thesisRepository.numberOfPage(false, title, idSupervisors, idCoSupervisorsThesis, keyword, type, groups, knowledge, expiration_date, cds, creation_date, 1);
  npage = Math.ceil(npage.nRows/nItem);
  //find information about teacher
  for (let i = 0; i < res.length; i++) {
    // get all the superior's information given an id
    const t = await teacherRepository.findById(res[i].supervisor);
    // add superior's information to each thesis
    res[i].supervisor = t;
  }
  //find ids about co-supervisors
  for (let i = 0; i < res.length; i++) {
    const idList =
      await coSupervisorThesisRepository.findCoSupervisorIdsByThesisId(
        res[i].id
      );
    res[i].coSupervisor = [];
    for (let j = 0; j < idList.length; j++) {
      if (idList[j].idTeacher != null) {
        const t = await teacherRepository.findById(idList[j].idTeacher);
        res[i].coSupervisors.push(
          teacherRepository.fromTeacherToCoSupervisor(t)
        );
      } else {
        res[i].coSupervisors.push(
          await coSupervisorRepository.findById(idList[j].idCoSupervisor)
        );
      }
    }
  }
  return [res, npage];
};

/**
 * A student send his/her application for thesis {id} and attach his cv as json
 *
 * id Integer
 **/
exports.addApplication = function (id) { };

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

  try {
    let cosupervisor_ids = []
    let supervisor_ids = []

    // look for each co-supervisor id into COSUPERVISOR
    if (Array.isArray(thesis.cosupervisor) && thesis.cosupervisor[0].length!==0) {
      for (let email of thesis.cosupervisor) {
        let tmp = await coSupervisorRepository.findByEmail(email);
        if (Object.keys(tmp).length === 0) {
          tmp = await teacherRepository.findByEmail(email);
          if (Object.keys(tmp).length === 0) {
            throw {
              status: 400,
              error: `supervisor ${email} not found in COSUPERVISOR`,
            };
          }
          else supervisor_ids.push(tmp.id)
        }
        else cosupervisor_ids.push(tmp.id)
      }
    }


    // parse expiration date and creation date

    // ________________________________________________________________________TOBE checked the format with @frontend
    const exp_date = dayjs(thesis.expiration_date, "MM-DD-YYYY")
      .format("YYYY-MM-DD")
      .toString();
    thesis.expiration_date = exp_date;
    const creat_date = dayjs().format("YYYY-MM-DD").toString();
    thesis.creation_date = creat_date;

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
    if (thesis_res.err_message) {
      throw { status: 500, error: thesis_res.err };
    }

    let result
    if(cosupervisor_ids.length > 0) {
      for(let id of cosupervisor_ids) {
        result = await coSupervisorThesisRepository.addCoSupervisorThesis(thesis_res.id, null, id)
        if (result != true) {
          throw { status: 500, error: result.err };
        }
      }
    }
    if(supervisor_ids.length > 0) {
      for(let id of supervisor_ids) {
        result = await coSupervisorThesisRepository.addCoSupervisorThesis(thesis_res.id, id, null)
        if (result != true) {
          throw { status: 500, error: result.err };
        }
      }
    }

    return thesis;
  }
  catch (error) {
    return error
  }
};

exports.updateThesis = async function (thesis, thesis_id) {
  try {
    let cosupervisor_ids = [];
    let supervisor_ids = [];

    // Look for each co-supervisor id into COSUPERVISOR
    console.log(thesis.cosupervisor);
    if (Array.isArray(thesis.cosupervisor) && thesis.cosupervisor[0].length !== 0) {
      for (let email of thesis.cosupervisor) {
        let tmp = await coSupervisorRepository.findByEmail(email);
        if (Object.keys(tmp).length === 0) {
          tmp = await teacherRepository.findByEmail(email);
          if (Object.keys(tmp).length === 0) {
            throw {
              status: 400,
              error: `Supervisor ${email} not found in COSUPERVISOR`,
            };
          } else {
            supervisor_ids.push(tmp.id);
          }
        } else {
          cosupervisor_ids.push(tmp.id);
        }
      }
    }

    const exp_date = dayjs(thesis.expiration_date, 'MM-DD-YYYY')
      .format('YYYY-MM-DD')
      .toString();
    thesis.expiration_date = exp_date;

    // Update the entry in THESIS
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

    if (updatedThesis.error) {
      throw { status: 500, error: updatedThesis.error };
    }

    // Remove existing co-supervisors for this thesis
    const removedCoSupervisors = await coSupervisorThesisRepository.removeCoSupervisorsByThesisId(
      thesis_id
    );

    if (removedCoSupervisors.error) {
      throw { status: 500, error: removedCoSupervisors.error };
    }

    // Add new co-supervisors for this thesis
    if (cosupervisor_ids.length > 0) {
      for (let id of cosupervisor_ids) {
        result = await coSupervisorThesisRepository.addCoSupervisorThesis(thesis_id, null, id);
        if (result !== true) {
          throw { status: 500, error: result.error };
        }
      }
    }
    if (supervisor_ids.length > 0) {
      for (let id of supervisor_ids) {
        result = await coSupervisorThesisRepository.addCoSupervisorThesis(thesis_id, id, null);
        if (result !== true) {
          throw { status: 500, error: result.error };
        }
      }
    }
    return updatedThesis;
  } catch (error) {
    return error;
  }
};

