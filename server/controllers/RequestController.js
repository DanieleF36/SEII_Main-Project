'use strict'
const requestService = require("../services/RequestService");
const requestRepository = require("../repositories/RequestRepository");
const applicationRepository = require('../repositories/ApplicationRepository');

exports.addRequest = function (req, res) {
    if(req.user!='student'){
        res.status(401).json({message: "Only student can access to this API"})
    }
    applicationRepository.getActiveByStudentId(req.user.id).then(app => {
        if (app != undefined) {
            res.status(400).json({ message: "You already have an application for a thesis" });
            return;
        }
        requestRepository.getActiveByStudentId(req.user.id).then(request => {
            if(request){
                res.status(400).json({message: "You already have done a request for a new thesis"})
                return;
            }
            requestService.addRequest(req.body, req.user.id)
            .then(request => res.status(200).json(request))
            .catch(err => { console.log(err); res.status(500).json({ message: err.message }) })
        }).catch(err=>{
            res.status(500).json({message: err.message});
        })
    }).catch(err=>{
        res.status(500).json({message: err.message})
    })

}

/**
 * Wrapper function to accept or reject a thesis request done by a student (secretary side)
 * @param {*} req with req.params.student_id, req.body.status (new request status), req.body.request_id, req.body.teacher_id
 * @param {*} res 
 * @returns 
 */
exports.thesisRequestHandling = function (req, res) {
    if (req.user.role != "secretary") {
        res.status(401).json({ message: 'You can not access to this route' });
        return
    }
    if (!req.params.student_id || req.params.student_id < 0) {
        res.status(400).json({ message: 'Bad request: student id is missing or minor than 0' });
        return;
    }
    if (!req.body.status || req.body.status < 0 || req.body.status > 1) {
        res.status(400).json({ message: 'Thesis status missing or invalid' });
        return;
    }
    if (!req.body.request_id || req.body.request_id < 0) {
        return res.status(400).json({ message: "Request id missing or invalid" })
    }
    if (!req.body.teacher_id || req.body.teacher_id < 0) {
        return res.status(400).json({ message: "Teacher id missing or invalid" })
    }
    requestService.thesisRequestHandling(req.body.status, req.params.id_student, req.body.request_id, req.body.teacher_id)
        .then(response => res.status(200).json(response))
        .catch((err) => res.status(500).json(err))
}

exports.getRequestsByProfessor = function (req, res) {
    if(req.user.role !== 'teacher') {
        res.status(401).json({ message: 'You can not access to this route' });
        return
    }
    requestService.getRequestsByProfessor(1)
        .then( resp => {
            res.status(200).json(resp)
        })
        .catch( err => res.status(500).json(err))
}

exports.getRequestAll = function (req, res) {
    if(req.user.role !== 'secretary') {
        res.status(401).json({ message: 'You can not access to this route' });
        return
    }
    requestService.getRequestAll()
        .then( resp => {
            res.status(200).json(resp)
        })
        .catch( err => res.status(500).json(err))
}
/**
 * Wrapper function for a professor to change the status of a thesis request
 * @param {*} req with req.body.request_id, req.body.statusTeacher
 * @param {*} res 
 * @returns 
 */
exports.professorThesisHandling = function (req, res) {
    if (req.user.role !== "teacher") {
        res.status(401).json({ message: 'You can not access this route' });
        return;
    }
    if (!req.body.request_id || req.body.request_id < 0) {
        res.status(400).json({ message: "Request id missing or invalid" });
        return;
    }
    if (!req.body.statusTeacher || req.body.statusTeacher < 0 || req.body.statusTeacher > 3) {
        res.status(400).json({ message: 'Thesis status (statusTeacher) missing or invalid' });
        return;
    }
    if (!req.body.teacher_id || req.body.teacher_id < 0) {
        return res.status(400).json({ message: "Teacher id missing or invalid" })
    }

    // Assuming there is a service function for professor thesis handling
    requestService.professorThesisHandling(req.body.request_id, req.body.status,req.body.teacher_id)
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json(err));
};
