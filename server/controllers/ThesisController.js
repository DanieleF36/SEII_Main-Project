"use strict";

const thesisService = require("../services/ThesisService");
const teacherService = require("../services/TeacherService");
/*
function isConvertible(str) {
  if(str=="undefined")
    return true;
  try {
    JSON.parse(str);
    return true;
  } catch (error) {}
  try {
    JSON.parse(`{${str}}`);
    return true;
  } catch (error) {}
  const sqlKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "FROM", "WHERE", "AND", "OR"];
  if (sqlKeywords.some((keyword) => str.includes(keyword))) {
    return true;
  }
  if (str.length >= 30) {
    return true;
  }
  return false;
}

function checkQuery(req) {
  const orderType = ["titleD", "titleA", "supervisorD", "supervisorA", "co-supervisorD", "co-supervisorA", "keywordD", "keywordA", "typeD", "typeA", "groupsD", "groupsA", "knowledgeD", "knowledgeA", "expiration_dateD", "expiration_dateA", "cdsD", "cdsA", "creation_dateD", "creation_dateA"];

  if (!(req.query.page && (req.query.page=="undefined" || parseInt(req.query.page) > 0))) {
    return "Wronged Value of page " + req.query.page;
  }
  
  if (req.query.order && (req.query.order=="undefined" || orderType.indexOf(req.query.order) < 0)) {
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
      });
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
*/
/**
 * /**
 * FOR TEACHER ONLY side
 * Wrapper function for recovering the whole set of ACTIVE thesis for the current logged in 
 * supervisor so that the expired ones as well as the ones which are in the archive are not
 * returned. This function could be affected by the fast forwarding in time by virtual clock
 * usage and that's managed at service level.
 * 
 * @param {*} req none
 * @param {*} res [thesis1, thesis2, ...]
 * ===============================================
 * wrapper function for performing advanced search over the database, possible fields for the search are:
 * - title
 * - supervisor, name lastname or lastname
 * - cosupervisor, array of as above  
 * - keywords array of string
 * - type array of string
 * - groups array of string
 * - knowledge array of string
 * - expiration_date string
 * - cds array of string
 * - creation_date string
 *
 * @returns SUCCESS: a json object as follow: {
 *  "nPage": nPage,
 *  "thesis": [ thesis1, ... ]
 * }
 * @returns ERROR: common error handling object
 * @returns ERROR: not authorized, only student can call this
 */
const { ValidationError } = require('express-json-validator-middleware');
exports.searchThesis = function searchThesis(req, res, validate) {
  if(req.user.role == 'student'){
    let validationResult;
    validate(req, res, (a)=>{validationResult = a});
    //console.log(JSON.stringify(validationResult))
    if (validationResult instanceof ValidationError)
      return res.status(400).json({error: validationResult.validationErrors});
    //checks if order is defined or not, otherwise titleD is setted as defaul value
    const order = req.query.order ? req.query.order : "titleD";

    thesisService.advancedResearchThesis(req.query.page, order, req.query.title, req.query.supervisor, req.query.coSupervisor, req.query.keyword, req.query.type, req.query.groups, req.query.knowledge, req.query.expiration_date, req.user.cds, req.query.creation_date, req.user.cdsCode)
      .then(function (response) {
        console.log(response);
        let nPage = response[1];
        response = response[0];
        response.forEach((e) => {
          e.supervisor = e.supervisor.name + " " + e.supervisor.surname;
          if (e.coSupervisors)
            e.coSupervisors.forEach((e1, index, v) => {
              v[index] = e1.name + " " + e1.surname;
            });
        });
        res.status(200).json({ nPage: nPage, thesis: response });
    }).catch(e=>{
      res.status(500).json(e)
    });
  }else if(req.user.role == 'teacher'){
    thesisService.getActiveBySupervisor(req.user.id)
    .then(response=>{
      res.status(200).json({ nPage: 1, thesis: response })
    })
    .catch(response=>{
      res.status(500).json(response);
    })
  }else{
    res.status(401).json({error: "Only student or teacher can access list of thesis"})
  }
};

/**
 * Wrapper function for adding a new thesis to the database
 *
 * @param {*} req in body: thesis object
 * @param {*} res SUCCESS: thesis object | ERROR: {error: "error msg"}
 * @param {*} next
 * @returns thesis object
 */
exports.addThesis = async function addThesis(req, res, validate) {
  if(req.user.role !== 'teacher'){
    return res.status(401).json({error:"You can not access to this route"})
  }
  let validationResult;
  validate(req, res, (a)=>{validationResult = a});
  //console.log(JSON.stringify(validationResult))
  if (validationResult instanceof ValidationError)
    return res.status(400).json({error: validationResult.validationErrors});

  if (req.body === undefined) {
    return res.status(400).json({ error: "body is missing" });
  }

  if(!req.body.groups.includes(req.user.group)){
    return res.status(400).json({error:"You are not allowed to add for this group"})
  }

  if( req.body.level === 'Master')
    req.body.level = 1;
  else
    req.body.level = 0;

  req.body.supervisor = req.user.id


/*
  //checks body
  if (req.body === undefined) {
    return res.status(400).json({ error: "body is missing" });
  }
  //checks level
  if (req.body.level === undefined || (req.body.level !== "Master" && req.body.level !== "Bachelor")) {
    return res.status(400).json({ error: "level value not recognized" });
  }
  //checks exp_date
  if (req.body.expiration_date === undefined | (req.body.expiration_date == "")) {
    return res
      .status(400)
      .json({ error: "expiration date is missing or not valid" });
  }

  //checks status
  if (req.body.status === undefined || req.body.status != 1) {
    return res
    .status(400)
    .json({ error: "status value not recognized or allowed" });
  }

  //checks cosup  
  if (!Array.isArray(req.body.cosupervisor)) {
    return res.status(400).json({ error: "cosupervisor is not an array" });
  }
  
  //checks keywords
  if (!Array.isArray(req.body.keywords)) {
    return res.status(400).json({ error: "keywords value not recognized" });
  }
  else {
    req.body.keywords = req.body.keywords.join();
  }

  //checks type
  if (req.body.type === undefined || !Array.isArray(req.body.type)) {
    return res.status(400).json({ error: "type value not recognized" });
  }
  else {
    console.log("22")
    req.body.type = req.body.type.join();
  }

  //checks groups NEW
  if (req.body.groups === undefined || !Array.isArray(req.body.groups)) {
    console.log("3")
    return res.status(400).json({ error: "groups value not recognized" });
  }else {
    console.log("33")
    req.body.groups = req.body.groups.join();
  }

  //checks cds NEW
  if (req.body.cds === undefined || !Array.isArray(req.body.cds)) {
    console.log("4")
    return res.status(400).json({ error: "cds value not recognized" });
  }
  else {
    console.log("44")
    req.body.cds = req.body.cds.join();
  }

  //checks knowledge NEW
  if (!Array.isArray(req.body.knowledge)) {
    console.log("5")
    return res.status(400).json({ error: "knowledge value not recognized" });
  }
  else {
    console.log("55")
    req.body.knowledge = req.body.knowledge.join();
  }

  if(req.body.title === undefined || req.body.title === ""){
    console.log("6")
    return res.status(400).json({error : "Title missing or empty string"})
  }
  */
  const response = await thesisService.addThesis(req.body)
  console.log(response)
  if(response.error) {
    return res.status(response.status).json()
  }
  else {
    return res.status(200).json(response)
  }
};

exports.updateThesis = async function updateThesis(req, res, validate) {
  if(req.user.role!=='teacher'){
    res.status(401).json({error:"You can not access to this route"})
    return;
  }
  let validationResult;
  validate(req, res, (a)=>{validationResult = a});
  //console.log(JSON.stringify(validationResult))
  if (validationResult instanceof ValidationError)
    return res.status(400).json({error: validationResult.validationErrors});

  if (!req.params.id) {
    res.status(400).json({error: "Thesis id is not valid"})
    return
  }
  if( req.body.level === 'Master')
    req.body.level = 1;
  else
    req.body.level = 0;

  req.body.supervisor = req.user.id

  if(!req.body.groups.includes(req.user.group)){
    return res.status(400).json({error:"You are not allowed to add for this group"})
  }

/*

  if (req.body.level === undefined || (req.body.level !== "Master" && req.body.level !== "Bachelor")) {
    return res.status(400).json({ error: "level value not recognized" });
  }

  if( req.body.level === 'Master'){
    req.body.level = 1;
    
  }
  else{
    req.body.level = 0;
  }

  if (req.body.supervisor === undefined) {
    return res.status(400).json({ error: "supervisor is missing" });
  }

  req.body.supervisor = req.user.id
  
  if (req.body.expiration_date === undefined || req.body.expiration_date === "") {
    return res.status(400).json({ error: "expiration date is missing or not valid" });
  }

  if (req.body.status === undefined || req.body.status !== 1) {
    return res.status(400).json({ error: "status value not recognized or allowed" });
  }

  if (!Array.isArray(req.body.cosupervisor)) {
    return res.status(400).json({ error: "cosupervisor is not an array" });
  }

  if (!Array.isArray(req.body.keywords)) {
    return res.status(400).json({ error: "keywords value not recognized" });
  }
  else {
    req.body.keywords = req.body.keywords.join();
  }

  //checks type
  if (req.body.type === undefined || !Array.isArray(req.body.type)) {
    return res.status(400).json({ error: "type value not recognized" });
  }
  else {
    req.body.type = req.body.type.join();
  }

  //checks groups NEW
  if (req.body.groups === undefined || !Array.isArray(req.body.groups)) {
    return res.status(400).json({ error: "groups value not recognized" });
  }
  else {
    req.body.groups = req.body.groups.join();
  }

  //checks cds NEW
  if (req.body.cds === undefined || !Array.isArray(req.body.cds)) {
    return res.status(400).json({ error: "cds value not recognized" });
  }
  else {
    req.body.cds = req.body.cds.join();
  }

  //checks knowledge NEW
  if (!Array.isArray(req.body.knowledge)) {
    return res.status(400).json({ error: "knowledge value not recognized" });
  }
  else {
    req.body.knowledge = req.body.knowledge.join();
  }

  if(req.body.title === undefined || req.body.title === ""){
    return res.status(400).json({error : "Title missing or empty string"})
  }
*/
  // Additional validation checks for the updateThesis method if needed

  // Call the updateThesis method from the thesisService
  const response = await thesisService.updateThesis(req.body, req.params.id);

  if (response.error) {
    return res.status(response.status).json(response.error);
  } else {
    return res.status(200).json(response);
  }
};

