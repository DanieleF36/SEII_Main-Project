'use strict';

const thesisService = require('../services/ThesisService');

exports.advancedResearchThesis = function advancedResearchThesis (req, res, next) {
    console.log("dentro thesis controller");
    /*
    if(req.query.page && req.query.page>0 && req.query.order && ((req.query.title && req.query.title) || (req.query.supervisor && req.query.supervisor) || (req.query.coSupervisor && req.query.coSupervisor) ||
    (req.query.keyword && req.query.keyword) || (req.query.type && req.query.type) || (req.query.groups && req.query.groups) || (req.query.knowledge && req.query.knowledge) ||
    (req.query.expiration_date && req.query.expiration_date) || (req.query.cds && req.query.cds) || (req.query.creation_date && req.query.creation_date)))
    */
    thesisService.advancedResearchThesis(req.query.page,req.query.order,req.query.title,req.query.supervisor,req.query.coSupervisor,req.query.keyword,req.query.type,req.query.groups,req.query.knowledge,req.query.expiration_date,req.query.cds,req.query.creation_date)
      .then(function (response) {
        response.supervisor = response.supervisor.name+" "+response.supervisor.surname;
        response.coSupervisors.forEach((e, index, v) => {
          v[index] = e.name+" "+e.surname;
        });
        res.status(200).json(response);
      })
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
  