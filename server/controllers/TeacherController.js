"use strict";

const teacherService = require("../services/TeacherService");

exports.accRefApplication = function accRefApplication(req, res, next) {
  if (req.body.accepted == undefined) {
    return res.status(400).json({ error: "Missing new status" });
  }
  teacherService
    .accRefApplication(
      req.body.accepted,
      req.params.id_professor,
      req.params.id_application
    )
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (response) {
      res.status(500).json(response);
    });
};

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
exports.listApplication = function listApplication(req, res, next) {
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
    return res.status(500).json(response.message);
    });
};

exports.acceptApplication = function acceptApplication(req, res, next) {
  if (req.body.accepted == undefined) {
    return res.status(400).json({ error: "Missing new status accpetApplication" });
  }
  console.log("acceptApplication CONTROLLER status = " + req.body.accepted);
  teacherService
    .acceptApplication(
      req.body.accepted,
      req.params.id_professor,
      req.params.id_application
    )
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (response) {
      res.status(500).json(response);
    });
};

exports.applyForProposal = async function (req, res, next) {
  console.log("applyForProposal CONTROLLER");
  teacherService.applyForProposal(
    1,
    req.params.id_thesis,
    req.body.cv_path
  ).then(function (response) {
    res.status(200).json(response);
  })
  .catch(function (response) {
    res.status(500).json(response);
  });
};