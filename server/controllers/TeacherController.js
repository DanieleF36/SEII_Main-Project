"use strict";

const teacherService = require("../services/TeacherService");

exports.accRefApplication = function accRefApplication(req, res, next) {
  console.log("CONTROLLER");
  teacherService
    .accRefApplication(
      req.body.accepted,
      req.params.id_professor,
      req.params.id_application
    )
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (response) {
      res.status(500).json(response);
    });
};

exports.listApplication = function listApplication(req, res, next) {
  teacherService
    .listApplication(req.params.id_professor)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (response) {
      res.status(500).json(response);
    });
};
