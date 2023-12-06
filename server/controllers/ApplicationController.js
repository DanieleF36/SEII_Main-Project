"use strict";
const applicationsService = require("../services/ApplicationService");
const teacherService = require('../services/TeacherService');
const studentService = require('../services/StudentService')
const studentRepository = require("../repositories/StudentRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const formidable = require('formidable');
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
                return res.status(200).json(response)
            })
            .catch(function (response) {
              return res.status(500).json(response);
            });
    }else if (req.user.role == 'student') {
        if (!req.user.id) {
            res.status(500).json({ error: "Given student's id is not valid" })
            return
        }
        studentService
            .browserApplicationStudent(req.user.id)
            .then(function (response) {
                return res.status(200).json(response)
            })
            .catch(function (response) {
                return res.status(500).json(response);
            });
    }
};

exports.acceptApplication = function acceptApplication(req, res) {
    if (req.user.role !== 'teacher') {
        res.status(401).json({ error: "You can not access to this route" })
        return;
    }
    if (!req.params.id_application || req.params.id_application < 0) {
        return res.status(400).json({ error: "Wronged id application" });
    }
    if (req.body === undefined) {
        return res.status(400).json({ error: "Body is missing" });
    }
    if (req.body.status == undefined) {
        return res.status(400).json({ error: "Missing new status acceptApplication" });
    }
    if (req.body.status == 1 || req.body.status == 2) {
        teacherService
            .acceptApplication(req.body.status, req.user.id, req.params.id_application)
            .then(function (response) {
                return res.status(200).json(response);
            })
            .catch(function (response) {
                return res.status(500).json(response);
            });
    }
    else {
        return res.status(400).json({ error: "Invalid new status entered" })
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
    if(req.user.role!=='student'){
      res.status(401).json({error:"You can not access to this route"})
      return;
    }
    if (!req.body) {
      return res.status(400).json({ error: "Body is missing" });
    }
    const checkApp = await studentRepository.searchApplicationByStudentId(req.user.id);
    if(checkApp == true) {
      return res.status(400).json({error : "You already have an application for a thesis"});
    }
    const supervisorId = await teacherRepository.getSupervisorIdByThesisId(req.params.id_thesis);
    if(supervisorId == undefined) {
      return res.status(400).json({error : "Supervisor not found"});
    }
    if (req.params.id_thesis != null) {
      //Initializes an object that is used to handle the input file in the multipart/form-data format 
      const form = new formidable.IncomingForm();
      //Translate the file into a js object and call it files
      form.parse(req, function (err, fields, files) {
        if(err)
          return res.status(500).json({error:"Internal Error"});
        if(!files.cv || !files.cv[0])
          return res.status(400).json({ error: "Missing file" });
        if(files.cv.length>1){
            return res.status(400).json({ error: "Multiple Files" });
          }
        const file = files.cv[0];
        applicationsService.addApplication(req.user.id, req.params.id_thesis, file, supervisorId)
        .then(function (response) {
          return res.status(201).json(response);
        })
        .catch(function (response) {
          if(response.error != "Not found"){
            return res.status(500).json({error:"Internal Error"});
          }
          else
            return res.status(404).json(response);
        });
      })
    } else {
      return res.status(400).json({ error: "Missing required parameters" });
    }
   
};

exports.addApplication = function addApplication(req, res, next) {
    applicationsService
        .addApplication(req.params.id)
        .then(function (response) {
        res.status(201).json(response);
        })
      .catch(function (response) {
        res.status(500).json(response);
      });
};