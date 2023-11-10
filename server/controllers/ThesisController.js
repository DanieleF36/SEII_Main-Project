'use strict';

const thesisService = require('../services/ThesisService');

/**
 * wrapper function for performing advanced search over the database, possible fields for the search are:
 * - title
 * - supervisor, name and/or lastname
 * - cosupervisor, as above
 * - keywords
 * - type
 * - groups
 * - knowledge
 * - expiration_date
 * - cds
 * - creation_date
 * 
 * @returns SUCCESS: a json object as follow: {
 *  "nPage": nPage,
 *  "thesis": [ thesis1, ... ]
 * }
 * @returns ERROR: common error handling object
 */
exports.advancedResearchThesis = function advancedResearchThesis (req, res, next) {
  const orderType = ["titleD", "titleA", "supervisorD", "supervisorA", "co-supervisorD","co-supervisorA","keywordD", "keywordA", "typeD", "typeA","groupsD","groupsA","knowledgeD","knowledgeA", "expiration_dateD","expiration_dateA", "cdsD", "cdsA", "creation_dateD", "creation_dateA"]
  /*  
  if(!(req.query.page && req.query.page>0 && (orderType.indexOf(req.query.order)>=0 || (req.query.title && req.query.title instanceof String) || (req.query.supervisor && req.query.supervisor instanceof String) || (req.query.coSupervisor && req.query.coSupervisor instanceof String) ||
    (req.query.keyword && req.query.keyword instanceof String) || (req.query.type && req.query.type instanceof String) || (req.query.groups && req.query.groups instanceof String) || (req.query.knowledge && req.query.knowledge instanceof String) ||
    (req.query.expiration_date && req.query.expiration_date instanceof String) || (req.query.cds && req.query.cds instanceof String) || (req.query.creation_date && req.query.creation_date instanceof String)))){
      res.status(400).json({error:""});
      return;
    }
    */

    //checks if order is defined or not, otherwise titleD is setted as defaul value
    const order = req.query.order?req.query.order:"titleD";

    thesisService.advancedResearchThesis(req.query.page,order,req.query.title,req.query.supervisor,req.query.coSupervisor,req.query.keyword,req.query.type,req.query.groups,req.query.knowledge,req.query.expiration_date,req.query.cds,req.query.creation_date)
      .then(function (response) {
        let nPage = response[1];
        response = response[0];
        response.forEach((e)=>{
          e.supervisor = e.supervisor.name+" "+e.supervisor.surname;
          if(e.coSupervisors)
            e.coSupervisors.forEach((e1, index, v) => {
              v[index] = e1.name+" "+e1.surname;
            });
          res.status(200).json({"nPage":nPage, "thesis":response});
        });
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
  
/**
 * Wrapper function for adding a new thesis to the database
 * 
 * @param {*} req in body: thesis object
 * @param {*} res SUCCESS: thesis object | ERROR: {error: "error msg"}
 * @param {*} next 
 * @returns thesis object
 */
exports.addThesis = function addThesis (req, res, next) { 
  if(!req.body) {
    res.status(400).json({error: "body is missing"}).send()
  }

  if(!req.body.supervisor) {
    res.status(400).json({error: "supervisor is missing"}).send()
  }

  if(!req.body.expiration_date | req.body.expiration_date == '') {
    res.status(400).json({error: "expiration date is missing or not "}).send()
  }

  if(!req.body.level || ( req.body.level != 0 && req.body.level != 1)) {
    res.status(400).json({error: "level value not recognized"}).send()
  }

  if(!req.body.status || req.body.status != 1) {
    res.status(400).json({error: "status value not recognized or allowed"}).send()
  }

  // forcing the format
  if(req.body.keywords) {
    req.body.keywords = req.body.keywords.join()
  }

  thesisService.addThesis(req.body)
      .then(function (response) {
        res.status(201).json(response);
      })
      .catch(function (err) {
        res.status(err.status).json({error: err})
      });
  };
  