"use strict";

const applicationRepository = require("../repositories/ApplicationRepository.js");
const thesisRepository = require('../repositories/ThesisRepository.js')
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
exports.acceptApplication = async function (status,teacherID,applicationID) {
    let res = await applicationRepository.acceptApplication(status,teacherID,applicationID)
    return res;
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