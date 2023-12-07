'use strict'
const coSupervisorRepository = require("../repositories/CoSupervisorRepository");
/**
 * Retrive the all the email of all the Cosupervisor
 * @returns array of CoSupervisorsEmail (string)
*/
exports.getAllCoSupervisorsEmailsService = async function () {
    const result = await coSupervisorRepository.getAllEmails();
    return result
  };
  