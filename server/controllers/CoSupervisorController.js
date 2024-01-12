'use strict'
const cosupervisorService = require("../services/CoSupervisorService");

exports.getAllCoSupervisorsEmails = function (req, res) {
  if(req.user.role !== 'teacher' && req.user.role !== 'student'){
    res.status(401).json({message: "Only teacher or student can access to this API"});
    return;
  }
  cosupervisorService.getAllCoSupervisorsEmailsService()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({message:'Internal server error'});
    })
  };