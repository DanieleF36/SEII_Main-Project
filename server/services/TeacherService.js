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
  try {
    if ((accepted != null, id_professor != null, id_application != null)) {
      let res = await applicationRepository.accRefApplication(
        accepted,
        id_professor,
        id_application
      );
    }
    return res;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all the application for the professor
 *
 * id_professor Integer
 * returns List
 **/
exports.listApplication = async function (id_professor) {
  try {
    if (id_professor != null) {
      console.log("SERVICE");
      let res = await applicationRepository.listApplication(id_professor);
      return res.status(200).json();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
