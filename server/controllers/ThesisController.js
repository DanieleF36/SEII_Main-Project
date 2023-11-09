'use strict';

const thesisService = require('../services/ThesisService');

exports.advancedResearchThesis = function advancedResearchThesis (req, res, next) {
    console.log("dentro thesis controller");
    thesisService.advancedResearchThesis(req.query.page,req.query.title,req.query.supervisor,req.query.coSupervisor,req.query.keyword,req.query.type,req.query.groups,req.query.knowledge,req.query.expiration_date,req.query.cds,req.query.creation_date)
      .then(function (response) {
        res.status(200).json(response);
      })
      .catch(function (response) {
        console.log("dentro errore di thesis controller "+JSON.stringify(response));
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
  thesisService.addThesis(req.body)
      .then(function (response) {
        res.status(201).json(response);
      })
      .catch(function (err) {
        res.status(err.status).json({error: err})
      });
  };
  