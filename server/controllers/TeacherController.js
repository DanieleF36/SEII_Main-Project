'use strict';

const teacherService = require('../services/ThesisService');

exports.accRefApplication = function accRefApplication (req, res, next) {
    teacherService.accRefApplication(req.body.accepted, req.params.id_professor, req.params.id_application)
    .then(function (response) {
      res.status(200).json(response);
    })
    .catch(function (response) {
    });
};

exports.listApplication = function listApplication (req, res, next, id_professor) {
    teacherService.listApplication(req.params.id_professor)
    .then(function (response) {
        res.status(200).json(response);
    })
    .catch(function (response) {
    });
};
