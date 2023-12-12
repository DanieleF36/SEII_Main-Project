'use strict'
const cosupervisorService = require("../services/CoSupervisorService");

exports.getAllCoSupervisorsEmails = function (req, res) {
  if(req.user.role !== 'teacher'){
    res.status(401).json({error: "Only teacher can access to this API"});
    return;
  }
  cosupervisorService.getAllCoSupervisorsEmailsService()
    .then((result) => {
      res.status(200).json(result);

    })
    .catch((err) => {
      res.status(500).json({error:'Internal server error'});
    })
  };