'use strict'
const supervisorService = require("../services/TeacherService");

exports.getAllCoSupervisorsEmails = function (req, res) {
  supervisorService.getAllSupervisorsEmailsService()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({message:'Internal server error'});
    })
  };