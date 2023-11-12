"use strict";

const applicationRepository = require("../repositories/ApplicationRepository.js");

/**
 * Theacher accept or reject an application
 *
 * accepted bool
 * id_professor Integer
 * id_application Integer
 * no response value expected for this operation
 **/
exports.accRefApplication = async function (
  accepted,
  id_professor,
  id_application
) {
  if ((accepted != null, id_professor != null, id_application != null)) {
    console.log("SERVICE");
    let res = await applicationRepository.accRefApplication(
      accepted,
      id_professor,
      id_application
    );
    return res;
  } else {
    return res.error;
  }
};

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
 *
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
  console.log("acceptApplication SERVICE status = " + accepted);
  if ((accepted != null, teacherID != null, applicationID != null)) {
    console.log("SERVICE");
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

/**
 * Apply for a proposal
 *
 * studentId Integer
 * thesisId Integer
 * cvPath String
 * teacherID Integer
 * no response value expected for this operation
 **/
exports.applyForProposal = async function (studentId, thesisId, cvPath) {
  console.log("Student ID:", studentId);
  console.log("Thesis ID:", thesisId);
  console.log("CV Path:", cvPath);
  if (studentId != null && thesisId != null && cvPath != null) {
    console.log("applyForProposal SERVICE studentID = " + studentId);
    try {
      let res = await applicationRepository.applyForProposal(
        studentId,
        thesisId,
        cvPath
      );
      return res;
    } catch (error) {
      return { error: error.message };
    }
  } else {
    return { error: "Missing required parameters" };
  }
};
