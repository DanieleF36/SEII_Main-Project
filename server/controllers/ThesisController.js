'use strict';

const thesisService = require('../services/ThesisService');

function isConvertible(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
  }
  try {
    JSON.parse(`{${str}}`);
    return true;
  } catch (error) {
  }
  const sqlKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "FROM", "WHERE", "AND", "OR"];
  if (sqlKeywords.some(keyword => str.includes(keyword))) {
    return true;
  }
  if (str.length >= 30) {
    return true;
  }
  return false;
}

function checkQuery(req){
  const orderType = ["titleD", "titleA", "supervisorD", "supervisorA", "co-supervisorD","co-supervisorA","keywordD", "keywordA", "typeD", "typeA","groupsD","groupsA","knowledgeD","knowledgeA", "expiration_dateD","expiration_dateA", "cdsD", "cdsA", "creation_dateD", "creation_dateA"]
 
  if (!(req.query.page && parseInt(req.query.page) > 0)) {
    return "Wronged Value of page "+req.query.page;
  }
  
  if (req.query.order && orderType.indexOf(req.query.order) < 0) {
    return "Wronged Value of order"+req.query.order
  }
  
  if (req.query.title && (Array.isArray(req.query.title) || isConvertible(req.query.title))) {
    return "Wronged Value of title"+req.query.title
  }
  if ((req.query.supervisor && (Array.isArray(req.query.supervisor) || isConvertible(req.query.supervisor)))) {
    return "Wronged Value of supervisor"+req.query.supervisor
  }
  if (req.query.coSupervisor){
    if(!Array.isArray(req.query.coSupervisor)){
      if( isConvertible(e)) {
        return "Wronged Value of coSupervisor"+req.query.coSupervisor
      };
    }
    else{
      req.query.coSupervisor.forEach((e)=>{
        if( isConvertible(e)) {
          return "Wronged Value of coSupervisor"+req.query.coSupervisor
        };
      });
    }  
  }
  if (req.query.keyword) {
    if(!Array.isArray(req.query.keyword)){
      if( isConvertible(req.query.keyword)) {
        return "Wronged Value of keyword"+req.query.keyword
      };
    }
    else
      req.query.keyword.forEach((e)=>{
        if(isConvertible(e)){
          return "Wronged Value of keyword"+req.query.keyword  
        }    
      })
  }
  if (req.query.type ) {
    if(!Array.isArray(req.query.type)){
      if( isConvertible(req.query.type)) {
        return "Wronged Value of keyword"+req.query.type
      };
    }
    else
      req.query.type.forEach((e)=>{
        if(isConvertible(e)){
          return "Wronged Value of type"+req.query.type
        }
      })
  }
  
  if (req.query.groups && (Array.isArray(req.query.groups) || isConvertible(req.query.groups))) {
    return "Wronged Value of groups"+req.query.groups
  }
  
  if (req.query.knowledge && (Array.isArray(req.query.knowledge) || isConvertible(req.query.knowledge))) {
    return "Wronged Value of knowledge"+req.query.knowledge
  }
  
  if (req.query.expiration_date && (Array.isArray(req.query.expiration_date) || isConvertible(req.query.expiration_date))) {
    return "Wronged Value of expiration_date"+req.query.expiration_date
  }
  
  if (req.query.cds && (Array.isArray(req.query.cds) || isConvertible(req.query.cds))) {
    return "Wronged Value of cds"+req.query.cds
  }
  
  if (req.query.creation_date && (Array.isArray(req.query.creation_date) || isConvertible(req.query.creation_date))) {
    return "Wronged Value of creation_date"+req.query.creation_date
  }
  return false;
}
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
  const error = checkQuery(req) 
  if(error){
      res.status(400).json({error:error});
      return;
    }
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
        });
        res.status(200).json({"nPage":nPage, "thesis":response});
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
  thesisService.addThesis(req.body)
      .then(function (response) {
        res.status(201).json(response);
      })
      .catch(function (err) {
        res.status(err.status).json({error: err})
      });
  };
  