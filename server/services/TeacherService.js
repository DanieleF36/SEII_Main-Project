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
    if(!teacherID || teacherID<0)
        throw new Error("teacherID must exists and be greater than 0");
    if(!applicationID || applicationID<0)
        throw new Error("applicationID must exists and be greater than 0");
    if(!status || status<0 || status>3)
        throw new Error("status must exists and be one or two or three");
    let row = await applicationRepository.getApplication(applicationID);
    if (!row) {
        throw new Error("No application was found, application is missing or is of another teacher");
    }
    const id_thesis = row.id_thesis;
    const id_student = row.id_student;
    if(row.id_teacher != teacherID)
        throw new Error("This application does not own to that teacher, he cant accept it");
    await applicationRepository.updateStatus(applicationID, status);
    if (status === 1) {
        await applicationRepository.updateStatusToCancelledForOtherStudent(id_thesis, id_student);
        await thesisRepository.setStatus(id_thesis, 0);
        // Execute the promises sequentially
        await _sendCancelledEmails(teacherID, id_thesis,applicationID, id_student);
        await _sendAcceptedEmail(teacherID, id_thesis, id_student);
        //resolve({ message: "Application and Thesis updated successfully." });
    } else {
        // If the status is 2 -> rejected, then resolve directly
        await _sendRejectedEmail(teacherID, id_thesis, id_student);
        //resolve({ message: "Application updated successfully." })
    }
    return status;
};

// Send a notification to the rejected student 
async function _sendRejectedEmail(teacherID, id_thesis, id_student) {
    if(!teacherID || teacherID<0)
        throw new Error("teacherID must exists and be greater than 0");
    
    if(!id_thesis || id_thesis<0)
        throw new Error("id_thesis must exists and be greater than 0");    
    if(!id_student || id_student<0)
        throw new Error("id_student must exists and be greater than 0");
    const [teacherEmail, studentEmail, thesisTitle] = await Promise.all([teacherRepo.getTeacherEmail(teacherID), studentRepo.getStudentEmail(id_student), thesisRepository.getThesisTitle(id_thesis)])
    await transporter.sendEmail(teacherEmail, studentEmail, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to rejected.`);

};

// Send a notification to all the students with the new status cancelled
async function _sendCancelledEmails(teacherID, id_thesis,id_application, id_student)  {
    if(!teacherID || teacherID<0)
        throw new Error("teacherID must exists and be greater than 0");
    
    if(!id_thesis || id_thesis<0)
        throw new Error("id_thesis must exists and be greater than 0");    
    if(!id_student || id_student<0)
        throw new Error("id_student must exists and be greater than 0");
    const [teacherEmail, thesisTitle, studentEmailCancelledArray] = await Promise.all([teacherRepo.getTeacherEmail(teacherID), thesisRepository.getThesisTitle(id_thesis), studentRepo.getStudentEmailCancelled(id_student,id_application, id_thesis)])
    console.log(teacherEmail+" "+thesisTitle+" "+JSON.stringify(studentEmailCancelledArray));
    for(let i of studentEmailCancelledArray){
        await transporter.sendEmail(teacherEmail, i, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to cancelled.`);
    }
        /*
    const emailPromises = studentEmailCancelledArray.map(async (element) => {
        await transporter.sendEmail(teacherEmail, element, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to cancelled.`);
    })
    // Wait for all email promises to resolve
    return Promise.all(emailPromises);
      */
};
  
  // Send a notification to the student accepted
async function _sendAcceptedEmail(teacherID, id_thesis, id_student){
    if(!teacherID || teacherID<0)
        throw new Error("teacherID must exists and be greater than 0");
    if(!id_thesis || id_thesis<0)
        throw new Error("id_thesis must exists and be greater than 0");    
    if(!id_student || id_student<0)
        throw new Error("id_student must exists and be greater than 0");
    const [teacherEmail, studentEmail, thesisTitle] = await Promise.all([teacherRepo.getTeacherEmail(teacherID), studentRepo.getStudentEmail(id_student), thesisRepository.getThesisTitle(id_thesis)])
    await transporter.sendEmail(teacherEmail, studentEmail, 'Application Status Update', `Your application status for ${thesisTitle} has been updated to accepted.`)
        
};

exports.browseProposals = async function(supervisor, queryParam) {
    const today = dayjs.vc()
    if(!today.isValid())
        return {status: 500, error: 'internal error'}
    if(queryParam!=0 && queryParam!=1)
        return {status: 500, error: 'internal error'}
    const date = today.format('YYYY-MM-DD').toString()
    const response = await thesisRepository.getActiveThesis(supervisor, date, queryParam)
    if(!Array.isArray(response)) {
        return {status: 500, error: 'internal error'}
    }
    else {
        return response
    }
}

// Esporta funzioni Private solo per i test
if (process.env.NODE_ENV === 'test') {
    module.exports._sendRejectedEmail = _sendRejectedEmail;
    module.exports._sendCancelledEmails = _sendCancelledEmails;
    module.exports._sendAcceptedEmail = _sendAcceptedEmail;
}