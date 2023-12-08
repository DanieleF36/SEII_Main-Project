'use strict'
const cosupervisorService = require("../services/CoSupervisorService");

exports.getAllCoSupervisorsEmails = async function (req, res) {
  if(req.user.role !== 'teacher'){
    res.status(401).json({message: "Only teacher can access to this API"});
    return;
  }
  try {
    const result = await cosupervisorService.getAllCoSupervisorsEmailsService();
    res.status(200).json(result.data);
  } catch (message) {
    res.status(500).json({message:'Internal server error'});
  }
  };