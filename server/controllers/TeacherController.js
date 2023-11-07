'use strict';

const teacherService = require('../services/ThesisService');

module.exports.accRefApplication = function accRefApplication (req, res, next) {
    teacherService.accRefApplication(req.body.accepted, req.params.id_professor, req.params.id_application)
    .then(function (response) {
      res.status(204);
    })
    .catch(function (response) {
    });
};

module.exports.listApplication = function listApplication (req, res, next, id_professor) {
    teacherService.listApplication(id_professor)
    .then(function (response) {
        res.status(200).json(response);
    })
    .catch(function (response) {
      
    });
};
