"use strict";

const applicationRepository = require("../repositories/ApplicationRepository.js");

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
exports.acceptApplication = async function (
  accepted,
  teacherID,
  applicationID
) {
  if ((accepted != null, teacherID != null, applicationID != null)) {
    let res = await applicationRepository.acceptApplication(
      accepted,
      teacherID,
      applicationID
    );
    return res;
  } else {
    return res.error;
  }
};