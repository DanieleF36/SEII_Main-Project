'use strict'
const cosupervisorService = require("../services/CoSupervisorService");

exports.getAllCoSupervisorsEmails = async function (req, res) {
  if(req.user.role !== 'teacher')
    return res.status(401).json({error: "Only teacher can access to this API"});
  try {
    const result = await cosupervisorService.getAllCoSupervisorsEmailsService();
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }
  };