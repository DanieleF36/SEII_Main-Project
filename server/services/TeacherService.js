"use strict";

const applicationRepository = require("../repositories/ApplicationRepository.js");
const thesisRepository = require('../repositories/ThesisRepository.js');
const transporter = require('../email/transporter');
const teacherRepo = require('../repositories/TeacherRepository');
const studentRepo = require('../repositories/StudentRepository');
const requestRepo = require('../repositories/RequestRepository.js')
/**
 * Get all the application for the professor
 *
 * @param {*} id_professor Integer
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
exports.browseApplicationProfessor = async function (id_professor) {
    let res = await applicationRepository.getByTeacherId(id_professor);
    return res;
};

/**
 * Teacher accept or reject an application
 * accepted bool
 * id_professor Integer
 * id_application Integer
 * no response value expected for this operation
 **/
exports.acceptApplication = async function (status, teacherID, applicationID) {
    let row = await applicationRepository.getById(applicationID);
    if (!row) {
        throw new Error("No application was found, application is missing or is of another teacher");
    }
    const id_thesis = row.id_thesis;
    const id_student = row.id_student;
    if (row.id_teacher != teacherID)
        throw new Error("This application does not own to that teacher, he cant accept it");
    await applicationRepository.updateStatus(applicationID, status);
    if (status === 1) {
        await applicationRepository.updateStatusToCancelledForOtherStudent(id_thesis, id_student);
        await thesisRepository.setStatus(id_thesis, 0);
        // Execute the promises sequentially
        await _sendCancelledEmails(teacherID, id_thesis, applicationID, id_student);
        await _sendAcceptedEmail(teacherID, id_thesis, id_student);
    } else {
        // If the status is 2 -> rejected, then resolve directly
        await _sendRejectedEmail(teacherID, id_thesis, id_student);
    }
    return status;
};

// Send a notification to the rejected student 
async function _sendRejectedEmail(teacherID, id_thesis, id_student) {
    let [teacherEmail, studentEmail, thesisTitle] = await Promise.all([
        teacherRepo.getById(teacherID),
        studentRepo.getById(id_student),
        thesisRepository.getById(id_thesis)]);
    teacherEmail = teacherEmail.map(e => e.email)
    studentEmail = studentEmail.map(e => e.email)
    thesisTitle = thesisTitle.title
    await transporter.sendEmail(teacherEmail, studentEmail, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to rejected.`);
    return true
};

// Send a notification to all the students with the new status cancelled
async function _sendCancelledEmails(teacherID, id_thesis, id_application, id_student) {
    let [teacherEmail, thesisTitle, studentEmailCancelledArray] = await Promise.all([
        teacherRepo.getById(teacherID),
        thesisRepository.getById(id_thesis),
        studentRepo.getStudentEmailCancelled(id_application, id_thesis)]);
    teacherEmail = teacherEmail.email;
    thesisTitle = thesisTitle.title;
    for (let i of studentEmailCancelledArray) {
        await transporter.sendEmail(teacherEmail, i, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to cancelled.`);
    }
    return true
};

// Send a notification to the student accepted
async function _sendAcceptedEmail(teacherID, id_thesis, id_student) {
    let [teacherEmail, studentEmail, thesisTitle] = await Promise.all([
        teacherRepo.getById(teacherID),
        studentRepo.getById(id_student),
        thesisRepository.getById(id_thesis)]);

    teacherEmail = teacherEmail.email;
    studentEmail = studentEmail.email;
    thesisTitle = thesisTitle.title;
    await transporter.sendEmail(teacherEmail, studentEmail, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to accepted.`)
    return true;
};

/**
 * Send a mail to the teacher when an application is made for his thesis
 * @param {*} teacherID 
 * @param {*} id_thesis 
 * @param {*} id_student 
 * @returns 
 */
exports._sendTeacherEmail = async function (teacherID, id_thesis, id_student) {
    let [teacherEmail, studentEmail, thesisTitle] = await Promise.all([
        teacherRepo.getById(teacherID),
        studentRepo.getById(id_student),
        thesisRepository.getById(id_thesis)]);

    teacherEmail = teacherEmail.email;
    studentEmail = studentEmail.email;
    thesisTitle = thesisTitle.title;
    await transporter.sendEmail(teacherEmail, studentEmail, 'New Application request received', `The thesis ${thesisTitle} has a new application request.`)
    return true;
}

/**
 * Send a mail to the teacher when a student thesis request is made for his thesis
 * @param {*} teacherID 
 * @param {*} id_student 
 * @returns 
 */
exports._sendTeacherEmailThesisRequest = async function (teacherID, id_student) {
    let [teacherEmail, student] = await Promise.all([
        teacherRepo.getById(teacherID),
        studentRepo.getById(id_student)])

    teacherEmail = teacherEmail.email;
    studentEmail = student.email;
    studentName = student.name
    studentSurname = student.surname
    await transporter.sendEmail(teacherEmail, studentEmail, 'New Thesis request received', `You have a new thesis request from ${studentName} ${studentSurname} .`)
    return true;
}

/**
 * TOBE changed and used for either the active and not active thesis
 * @param {*} supervisor id of a supervisor
 * @returns list of thesis object
 */
exports.browseProposals = async function (supervisor) {
    const response = await thesisRepository.getActiveBySupervisor(supervisor)
    return response
}

/**
 * Function that retrieve the student career information
 * @param {*} id_student id of the student
 * @returns array of object {title : string, grade : integer}
 */
exports.getCareerByStudentId = async function (id_student) {
    return await studentRepo.getCareerByStudentId(id_student)
}

/**
 * Retrive the all the email of all the Cosupervisor
 * @returns array of CoSupervisorsEmail (string)
*/
exports.getAllCoSupervisorsEmailsService = async function () {
    const result = await teacherRepo.getAllEmails();
    return result
  };
  

// Esporta funzioni Private solo per i test
if (process.env.test) {
    module.exports._sendRejectedEmail = _sendRejectedEmail;
    module.exports._sendCancelledEmails = _sendCancelledEmails;
    module.exports._sendAcceptedEmail = _sendAcceptedEmail;
}