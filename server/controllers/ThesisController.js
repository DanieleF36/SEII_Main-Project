'use strict';

const thesisService = require('../services/ThesisService');

exports.advancedResearchThesis = function advancedResearchThesis (req, res, next) {
    thesisService.advancedResearchThesis(req.params.title,req.params.supervisor,req.params.coSupervisor,req.params.keyword,req.params.type,req.params.groups,req.params.knowledge,req.params.expiration_date,req.params.cds,req.params.creation_date)
      .then(function (response) {
        res.status(200).json(response);
      })
      .catch(function (response) {
        
      });
  };
  
  exports.addApplication = function addApplication (req, res, next) {
    thesisService.addApplication(req.params.id)
      .then(function (response) {
        res.status(201).json(response);
      })
      .catch(function (response) {

      });
  };
  
exports.addThesis = function addThesis (req, res, next) {
    thesisService.addThesis(req.body.thesis)
      .then(function (response) {
        res.status(201).json(response);
      })
      .catch(function (response) {
        
      });
  };
  