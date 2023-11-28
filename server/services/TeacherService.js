"use strict";

const applicationRepository = require("../repositories/ApplicationRepository.js");
const thesisRepository = require('../repositories/ThesisRepository.js');
const transporter = require('../email/transporter');
const teacherRepo = require('../repositories/TeacherRepository');
const studentRepo = require('../repositories/StudentRepository');
const dayjs = require('../dayjsvc/index.dayjsvc.js')
/**
 * Get all the application for the professor
 *
 * @param {*} id_professor Integer
 * @returns object { application: application, thesis: thesis, student: student } defined in controller file
 **/
exports.listApplication = async function (id_professor) {
    let res = await applicationRepository.listApplication(id_professor);
    return res;
};

/**
 * Teacher accept or reject an application
 * accepted bool
 * id_professor Integer
 * id_application Integer
 * no response value expected for this operation
 **/
exports.acceptApplication = async  function (status,teacherID,applicationID) {
    let row = await applicationRepository.getApplication(applicationID);
    const id_thesis = row.id_thesis;
    const id_student = row.id_student;
    if(row.id_teacher != teacherID)
        throw new Error({error:"This application does not own to that teacher, he cant accept it"});
    await applicationRepository.updateStatus(applicationID, status);
    if (status === 1) {
        await applicationRepository.updateStatusToCancelledForOtherStudent(id_thesis, id_student);
        await thesisRepository.setStatus(id_thesis, 0);
        // Execute the promises sequentially
        await _sendCancelledEmails(teacherID, id_thesis, id_student);
        await _sendAcceptedEmail(teacherID, id_thesis, id_student);
        //resolve({ message: "Application and Thesis updated successfully." });
    } else {
        // If the status is 2 -> rejected, then resolve directly
        await _sendRejectedEmail(teacherID, id_thesis, id_student);
        //resolve({ message: "Application updated successfully." })
    }
    return {status: status};
};

// Send a notification to the rejected student 
const _sendRejectedEmail = (teacherID, id_thesis, id_student) => {
    return Promise.all([teacherRepo.getTeacherEmail(teacherID), studentRepo.getStudentEmail(id_student), thesisRepository.getThesisTitle(id_thesis),
    ])
        .then(([teacherEmail, studentEmail, thesisTitle]) => {
        transporter.sendEmail(teacherEmail, studentEmail, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to rejected.`).catch(e=>reject(e));
        });
};

// Send a notification to all the students with the new status cancelled
const _sendCancelledEmails = (teacherID, id_thesis, id_student) => {
    return Promise.all([teacherRepo.getTeacherEmail(teacherID), thesisRepository.getThesisTitle(id_thesis), studentRepo.getStudentEmailCancelled(id_student)])
      .then(([teacherEmail, thesisTitle, studentEmailCancelledArray]) => {
        const emailPromises = studentEmailCancelledArray.map((element) => {
          transporter.sendEmail(teacherEmail, element, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to cancelled.`)
              .catch(e=>reject(e));
        });
        // Wait for all email promises to resolve
        return Promise.all(emailPromises);
      });
};
  
  // Send a notification to the student accepted
const _sendAcceptedEmail = (teacherID, id_thesis, id_student) => {
    return Promise.all([teacherRepo.getTeacherEmail(teacherID), studentRepo.getStudentEmail(id_student), thesisRepository.getThesisTitle(id_thesis),
    ])
        .then(([teacherEmail, studentEmail, thesisTitle]) => {
        transporter.sendEmail(teacherEmail, studentEmail, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to accepted.`).catch(e=>reject(e));
        });
};

exports.browseApplication = async function(supervisor) {
    const today = dayjs.vc()
    if(!today.isValid())
        return {status: 500, error: 'internal error'}

    const date = today.format('YYYY-MM-DD').toString()
    const response = await thesisRepository.getActiveThesis(supervisor, date)
    if(!Array.isArray(response)) {
        return {status: 500, error: 'internal error'}
    }
    else {
        return response
    }
}