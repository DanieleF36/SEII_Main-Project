"use strict";

const teacherService = require("../services/TeacherService");

/**
 * wrapper function for showing the list of application received by a defined teacher given his id number
 * @param {*} req in params.id_professor is store the id
 * @param {*} res the returned object is defined as follow: 
 * {
 *  thesis: thesis,
 *  student: student,
 *  application: application
 * }
 * having:
 *  - application: [application1, application2, ...] where application-i is defined as follow:
 *        {
 *          id_application: a.id,
 *          id_student: a.id_student,
 *          id_thesis: a.id_thesis,
 *          data: a.data, 
 *          path_cv: a.path_cv,
 *          status: a.status
 *        }
 *  - student: [student1, student2, ...] where student-i is defined as follow:
 *        {
 *          surname: s.surname
 *          name: s.name
 *        }
 *  - thesis: [thesis1, thesis2, ...] where thesis-i is defined as follow:
 *        {
 *          title: t.title,
 *          cds: t.cds
 *        }
 * @param {*} next 
 */
exports.listApplication = function listApplication(req, res) {
  if(req.user.role!=='teacher'){
    res.status(401).json({error:"You can not access to this route"})
    return;
  }
  if(req.user.id !== req.params.id_professor) {
    res.status(401).json({error:"Unauthorized"})
    return;
  }
  if (!req.params.id_professor) {
    res.status(400).json({error: "given supervisor's id is not valid"})
    return
  }
  teacherService
  .listApplication(req.params.id_professor)
  .then(function (response) {
    return res.status(200).json(response)
  })
  .catch(function (response) {
    return res.status(500).json(response);
    });
};

exports.acceptApplication = function acceptApplication(req, res) {
  /*
  if(req.user.role!=='teacher'){
    res.status(401).json({error:"You can not access to this route"})
    return;
  }
  if(req.user.id !== req.params.id_professor) {
    res.status(401).json({error:"Unauthorized"})
    return;
  }
  */
  if(req.body === undefined) {
    return res.status(400).json({ error: "Body is missing" });
  }
  if (req.body.status == undefined) {
    return res.status(400).json({ error: "Missing new status acceptApplication" });
  }
  if(req.body.status == 1 || req.body.status == 2){
    teacherService
    .acceptApplication(req.body.status, req.params.id_professor, req.params.id_application)
    .then(function (response) {
      return res.status(200).json(response);
    })
    .catch(function (response) {
      return res.status(500).json(response);
    });
  }
  else{
    return res.status(400).json({error : "Invalid new status entered"})
  }
};

/**
 * FOR TEACHER ONLY
 * Wrapper function for recovering the whole set of ACTIVE thesis for the current logged in 
 * supervisor so that the expired ones as well as the ones which are in the archive are not
 * returned. This function could be affected by the fast forwarding in time by virtual clock
 * usage and that's managed at service level.
 * 
 * @param {*} req none
 * @param {*} res [thesis1, thesis2, ...]
 */
exports.browseProposals = async function (req, res) {
  if(req.user.role !== 'teacher'){
    return res.status(401).json({error:"You can not access to this route"})
  }

  const supervisor = req.user.id;

  const response = await teacherService.browseApplication(supervisor)
  if(response.error) {
    return res.status(response.status).json(response.error)
  }
  else {
    return res.status(200).json(response)
  }
}