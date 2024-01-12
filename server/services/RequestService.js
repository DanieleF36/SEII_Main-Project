'use strict'
const requestRepository = require("../repositories/RequestRepository");
const requestCoSupervisorRepository = require("../repositories/RequestCoSupervisorRepository");
const teacherRepository = require("../repositories/TeacherRepository");
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
const teacherService = require("../services/TeacherService")
const thesisRepository = require("../repositories/ThesisRepository")
const studentRepository = require("../repositories/StudentRepository")

exports.addRequest = async function (request, studentId) {
    request.supervisor = (await teacherRepository.getByEmail(request.supervisor)).id;
    const req = await requestRepository.addRequest(request, studentId);
    for (let i = 0; i < request.cosupervisor.length; i++) {
        const cosupervisor = await coSupervisorRepository.getByEmail(request.cosupervisor[i])
        if (cosupervisor.id)
            await requestCoSupervisorRepository.addCoSupervisor(req.id, cosupervisor.id);
        else {
            const internalCoSupervisor = await teacherRepository.getByEmail(request.cosupervisor[i]);
            if (internalCoSupervisor)
                await requestCoSupervisorRepository.addCoSupervisor(req.id, null, internalCoSupervisor.id);
            else
                throw new Error("coSupervisor Email " + request.cosupervisor[i] + " does not exist")
        }
    }
    return req;
}

/**
 * Function to accept a thesis request by the secretary. If the secreatary accepts the request the professor is also notified
 * @param {*} thesisId 
 * @param {*} status 
 * @param {*} id_student 
 * @param {*} request_id 
 * @param {*} teacher_id 
 * @returns status that is the request status
 */
exports.thesisRequestHandling = async function (thesisId, status, id_student, request_id, teacher_id) {
    const thesis = await thesisRepository.getById(thesisId)
    if (!thesis) {
        throw new Error("Thesis not found")
    }
    const student = await studentRepository.getById(id_student)
    if (!student) {
        throw new Error("Student not found")
    }
    const teacher = await teacherRepository.getById(teacher_id)
    if (!teacher) {
        throw new Error("Teacher not found")
    }
    const request = await requestRepository.getRequest(request_id)
    if (!request) {
        throw new Error("Request not found")
    }
    if (request.id_student != id_student) {
        throw new Error("Student id in the request db is different from the student id of the request sent")
    }
    if (request.supervisorId != teacher_id) {
        throw new Error("Teacher id in the request db is different from the teacher id of the request sent")
    }
    //Status = 1 -> request accepted so I send the email to the teacher to notify him
    if (status == 1) {
        await teacherService._sendTeacherEmailThesisRequest(teacher_id, thesisId, id_student)
    }
    await requestRepository.thesisRequestStatusUpdate(request_id, status)
    return status
}

/**
 * Service function for a professor to change the status of a thesis request
 * @param {*} request_id 
 * @param {*} statusTeacher 
 * @returns the updated status
 */
exports.professorThesisHandling = async function (request_id, statusTeacher) {
    const request = await requestRepository.getRequest(request_id);

    if (!request) {
        throw new Error("Request not found");
    }

    await requestRepository.profReqStatusUpdate(request_id, statusTeacher);

    return statusTeacher;
};