"use strict";

const teacherService = require("../services/TeacherService");

exports.applyForProposal = async function (req, res, next) {
  console.log("applyForProposal CONTROLLER");
  if (!req.body) {
    return res.status(400).json({ error: "Body is missing" });
  }
  if (/* studentId != null && */ req.params.id_thesis != null && req.body.cv != null) {
    teacherService.applyForProposal(
      1,
      req.params.id_thesis,
      req.body.cv
    ).then(function (response) {
      res.status(201).json(response);
    })
    .catch(function (response) {
      res.status(404).json(response);
    });
  } else {
    return res.status(400).json({ error: "Missing required parameters" });
  }
 
};