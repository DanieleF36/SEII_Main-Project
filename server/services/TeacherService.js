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
 * id_professor Integer
 * returns List
 **/
exports.listApplication = async function (id_professor) {
  if (id_professor != null) {
    console.log("SERVICE");
    let res = await applicationRepository.listApplication(id_professor);
    return res;
  } else {
    return res.error;
  }
};
