"use strict";
const applicationsService = require("../services/ApplicationService");
const teacherService = require('../services/TeacherService');
const studentService = require('../services/StudentService')
const studentRepository = require("../repositories/StudentRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const formidable = require('formidable');
const applicationRepository = require('../repositories/ApplicationRepository')
/**
 * wrapper function for showing the list of application for the teacher or for the student based on the role
 * @param {*} req in params.id_professor or params.id_student is stored the id
 * @param {*} res the returned object is defined as follow:
 * for the student application:
 * @returns an array of objects defined as
 * {
 *  title: string,
 *  supervisor_name: string,
 *  supervisor_surname: string,
 *  keywords: array of string,
 *  type: array of string,
 *  groups: array of string,
 *  description: string,
 *  knowledge: array of string,
 *  note: string,
 *  expiration_date: string,
 *  level: integer,
 *  cds: array of string,
 *  application_data: string,
 *  path_cv: string,
 *  status: integer,(this is application status) 
 * }
 * for the professor application
 * @returns an array of object 
 * { 
 * id_student: integer,
 * id_application: integer,
 * id_thesis: integer,
 * title: string,
 * name: string,
 * surname: string,
 * data: date,
 * path_cv: string,
 * status: integer
 * }
 */
exports.listApplication = function listApplication(req, res) {
    if (req.user.role != "teacher" && req.user.role != "student") {
        return res.status(401).json({ error: "You can't access to this route. You're not a student or a professor" });
    }
    if (req.user.role == 'teacher') {
        if (!req.user.id) {
            res.status(500).json({ error: "Given supervisor's id is not valid" })
            return
        }
        teacherService
            .browseApplicationProfessor(req.user.id)
            .then(function (response) {
                res.status(200).json(response)
            })
            .catch(function (response) {
              res.status(500).json(response);
            });
    }else if (req.user.role == 'student') {
        if (!req.user.id) {
          res.status(500).json({ error: "Given student's id is not valid" })
          return
        }
        studentService
            .browserApplicationStudent(req.user.id)
            .then(function (response) {
                res.status(200).json(response)
            })
            .catch(function (response) {
                res.status(500).json(response);
            });
    }
};

exports.acceptApplication = function acceptApplication(req, res) {
    if (req.user.role !== 'teacher') {
        res.status(401).json({ error: "You can not access to this route" })
        return;
    }
    if (!req.params.id_application || req.params.id_application < 0) {
        res.status(400).json({ error: "Wronged id application" });
        return;
    }
    if (req.body === undefined) {
        res.status(400).json({ error: "Body is missing" });
        return;
    }
    if (req.body.status == undefined) {
        res.status(400).json({ error: "Missing new status acceptApplication" });
        return;
    }
    if (req.body.status == 1 || req.body.status == 2) {
        teacherService
            .acceptApplication(req.body.status, req.user.id, req.params.id_application)
            .then(function (response) {
                res.status(200).json(response);
            })
            .catch(function (response) {
                res.status(500).json(response);
            });
    }
    else {
        res.status(400).json({ error: "Invalid new status entered" })
    }
};

/**
 * wrapper function for apply to a thesis proposal with id = id_thesis 
 * @param {*} req in req.params.id_thesis there is an iteger for the thesis
 *                in req.body.cv there is the cv in a PDF form
 * @param {*} res the returned object is defined as follow:
 * {
 *   id: integer,
 *   id_student: integer,
 *   id_thesis: integer,
 *   date: string,
 *   cv: {
 *     cv: //TODO
 *     }
 *   }
 */
exports.applyForProposal = async function (req, res) {
  if (req.user.role !== 'student') {
    res.status(401).json({ error: "You can not access to this route" })
    return;
  }
  if (!req.body) {
    res.status(400).json({ error: "Body is missing" });
    return;
  }
  const checkApp = await applicationRepository.getActiveByStudentId(req.user.id);
  if (checkApp != undefined) {
    res.status(400).json({ error: "You already have an application for a thesis" });
    return;
  }
  const supervisorId = await teacherRepository.getIdByThesisId(req.params.id_thesis);
  if (supervisorId == undefined) {
    res.status(400).json({ error: "Supervisor not found" });
    return;
  }
  if (req.params.id_thesis != null) {
    //Initializes an object that is used to handle the input file in the multipart/form-data format 
    const form = new formidable.IncomingForm();
    //Translate the file into a js object and call it files
    form.parse(req, function (err, fields, files) {
      if (err){
        res.status(500).json({ error: "Internal Error" });
        return;
      }
      if (!files.cv || !files.cv[0]){
        res.status(400).json({ error: "Missing file" });
        return;
      }
      if (files.cv.length > 1) {
        res.status(400).json({ error: "Multiple Files" });
        return;
      }
      const file = files.cv[0];
      applicationsService.addApplication(req.user.id, req.params.id_thesis, file, supervisorId)
        .then(function (response) {
          res.status(201).json(response);
        })
        .catch(function (response) {
          res.status(500).json(response);
        });
    })
  } else {
    res.status(400).json({ error: "Missing required parameters" });
  }
};