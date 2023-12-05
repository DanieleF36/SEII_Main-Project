"use strict";
const teacherService = require("../services/TeacherService");
const studentService = require("../services/StudentService");
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
    if (req.user.role != "teacher" || req.user.role != "student") {
        return res.status(401).json({ error: "You can't access to this route. You're not a student or a professor" });
    }
    if (req.user.role == 'teacher') {
        if (!req.user.id) {
            res.status(400).json({ error: "Given supervisor's id is not valid" })
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
    }
    if (req.user.role == 'student') {
        if (!req.user.id) {
            res.status(400).json({ error: "Given student's id is not valid" })
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
    if (req.user.id != req.params.id_professor) {

        res.status(401).json({ error: "Unauthorized" })
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
                console.log(response)
                if (response.error)
                    return res.status(500).json(response);
                else if (response.message)
                    return res.status(500).json({ error: response.message });
                else
                    return res.status(500).json({ error: response });
            });
    }
    else {
        return res.status(400).json({ error: "Invalid new status entered" })
    }
};