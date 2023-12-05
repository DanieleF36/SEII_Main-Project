'use strict'
const applicationService = require("../services/ApplicationService");

exports.getAllCoSupervisorsEmails = async function (req, res) {
    try {
      const result = await applicationService.getAllCoSupervisorsEmailsService();
      res.status(result.status).json(result.data || result.error);
    } catch (error) {
      console.error("Error in someControllerMethod:", error.message);
      res.status(500).json('Internal server error');
    }
  };