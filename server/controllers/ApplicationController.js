"use strict";
const applicationsService = require("../services/ApplicationService");
const teacherService = require('../services/TeacherService');
const studentService = require('../services/StudentService')
const teacherRepository = require("../repositories/TeacherRepository");
const formidable = require('formidable');
const applicationRepository = require('../repositories/ApplicationRepository')
const requestRepository = require('../repositories/RequestRepository')
const path = require('path');
const fs = require('fs');
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
    return res.status(401).json({ message: "You can't access to this route. You're not a student or a professor" });
  }
  if (req.user.role == 'teacher') {
    if (!req.user.id) {
      res.status(500).json({ message: "Given supervisor's id is not valid" })
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
  } else if (req.user.role == 'student') {
    if (!req.user.id) {
      res.status(500).json({ message: "Given student's id is not valid" })
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
    res.status(401).json({ message: "You can not access to this route" })
    return;
  }
  if (!req.params.id_application || req.params.id_application < 0) {
    res.status(400).json({ message: "Wronged id application" });
    return;
  }
  if (req.body === undefined) {
    res.status(400).json({ message: "Body is missing" });
    return;
  }
  if (req.body.status == undefined) {
    res.status(400).json({ message: "Missing new status acceptApplication" });
    return;
  }
  if (req.body.status == 1 || req.body.status == 2) {
    teacherService
      .acceptApplication(req.body.status, req.user.id, req.params.id_application)
      .then(function (response) {
        res.status(200).json(response);
      })
      .catch(function (response) {
        res.status(500).json({ message: response.message });
      });
  }
  else {
    res.status(400).json({ message: "Invalid new status entered" })
  }
};

/**
 * wrapper function for apply to a thesis proposal with id = id_thesis 
 * @param {*} req in req.params.id_thesis there is an iteger for the thesis
 *                in req.body.cv there is the cv in a PDF form
 * @returns object = {applicationID : integer, studentId: integer,date : date, status: 0, professorId: integer}
 */
exports.applyForProposal = async function (req, res) {
  if (req.user.role !== 'student') {
    res.status(401).json({ message: "You can not access to this route" })
    return;
  }
  if (!req.body) {
    res.status(400).json({ message: "Body is missing" });
    return;
  }
  requestRepository.getRequestByStudentId(req.user.id).then((request)=>{
    if (request != undefined) {
      res.status(400).json({ message: "You have an already a pending or accepted request" });
      return;
    }
    applicationRepository.getActiveByStudentId(req.user.id).then(checkApp => {
      const err = checkError(checkApp, req);
      if (err)
        return res.status(400).json(err)
      teacherRepository.getIdByThesisId(req.params.id_thesis).then(supervisorId => {
        if (supervisorId == undefined) {
          res.status(400).json({ message: "Supervisor not found" });
          return;
        }
        //Initializes an object that is used to handle the input file in the multipart/form-data format 
        const form = new formidable.IncomingForm({ maxFileSize: 32 * 1024 * 1024 });
        //Translate the file into a js object and call it files
        form.parse(req, function (err, fields, files) {
          if (err) {
            res.status(500).json({ message: "Internal Error" });
            return;
          }
          if (!files?.cv?.length > 1) {
            res.status(400).json({ message: "Missing file or multiple" });
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
  
      }).catch((e) => res.status(500).json({ message: e.message }))
    }).catch((e) => res.status(500).json({ message: e.message }))
  }).catch((e) => res.status(500).json({ message: e.message }))
};

const checkError = function (checkApp, req) {
  if (checkApp != undefined) {
    return { message: "You already have an application for a thesis" };
  }

  if (req.params.id_thesis == null) {
    return { message: "Missing required parameters" };
  }
}

/**
 * wrapper function to retrieve the cv of a student (professor side)
 * @param {*} req req.body.student_id I have the student id (professor side)
 */
exports.getStudentCv = function (req, res) {
  if (!req.params.student_id) {
    return res.status(400).json({ message: "Missing student id" })
  }
  if (req.user.role != 'teacher' && req.user.role != 'student') {
    return res.status(401).json({ message: "You can not access to this route" })
  }
  applicationRepository.getByStudentId(req.params.student_id).then(studentInfo => {
    if (studentInfo instanceof Error) {
      throw studentInfo
    }
    const studentCv = studentInfo[0].path_cv;
    let fileName = path.basename(studentCv);

    fs.access(studentCv, (err) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.status(200).download(studentCv, fileName)
      }
    });
  })
    .catch(error => {
      if (error instanceof Error) {
        return res.status(500).json(error)
      }
      return res.status(500).json(new Error(error.message));
    })
}

/**
 * Wrapper function to retrive the student career information
 * @param {*} req req.params.id_student the student id 
 * @returns array of object {title : string, grade: integer}
 */
exports.getCareerByStudentId = function (req, res) {
  if (req.user.role != "teacher") {
    res.status(401).json({ message: "You can not access to this route" });
    return;
  }
  if (!req.params.student_id || req.params.student_id < 0) {
    res.status(400).json({ message: "Missing student id or negative id" });
    return;
  }
  teacherService.getCareerByStudentId(req.params.student_id)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (response) {
      res.status(500).json(response);
    });
}