'use strict'
const thesisRepository = require("../repositories/ThesisRepository")
const studentRepository = require("../repositories/StudentRepository")
const teacherService = require("../services/TeacherService")
const teacherRepository = require("../repositories/TeacherRepository")

exports.thesisRequestHandling = async function (thesisId, status, id_student, teacher_id) {
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
    if (status == 1) {
        await teacherService._sendTeacherEmailThesisRequest(teacher_id, thesisId, id_student)
    }
    // TODO: see how to organize the new table with the student request thesis and then complete the function
    //const res = await secretaryRepository.thesisRequestHandling(thesisId,status,id_student)
    // return res
}