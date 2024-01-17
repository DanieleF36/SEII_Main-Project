"use strict";

const thesisService = require("../services/ThesisService");
/**
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
  if (req.user.role == 'student' || req.user.role == 'teacher') {
    //checks if order is defined or not, otherwise titleD is setted as defaul value
    const order = req.query.order ? req.query.order : "titleD";
    const supervisor = req.user.role == 'teacher'? req.user.id : req.query.supervisor;
    const cds = req.user.role == 'teacher'? req.query.cds : req.user.cds;
    const level = req.user.role == 'teacher'? req.query.level: req.user.cdsCode;
    const status = req.user.role == 'teacher'? req.query.status: 1;
    thesisService.advancedResearchThesis(req.query.page, order, req.query.title, supervisor, req.query.coSupervisor, req.query.keywords, req.query.type, req.query.groups, req.query.knowledge, req.query.expiration_date, cds, req.query.creation_date, level, status)
      .then(function (response) {
        let nPage = response[1];
        response = response[0];
        response.forEach((e) => {
          if (req.user.role == 'student')
            e.supervisor = e.supervisor.name + " " + e.supervisor.surname;
          else
            e.supervisor = e.supervisor.id
          if (e.coSupervisors)
            e.coSupervisors.forEach((e1, index, v) => {
              v[index] = e1.name + " " + e1.surname;
            });
        });
        res.status(200).json({ nPage: nPage, thesis: response });
      }).catch(e => {
        res.status(500).json({ message: e.message })
      });
  } /*else if (req.user.role == 'teacher') {
    const queryParam = parseInt(req.query.status);
    if (queryParam != 0 && queryParam != 1) {
      res.status(400).json({ message: "status not valid" });
      return;
    }
    thesisService.getActiveBySupervisor(req.user.id, queryParam)
      .then(response => {
        console.log(response)
        res.status(200).json({ nPage: 1, thesis: response })
      })
      .catch(response => {
        res.status(500).json(response);
      })
  } */else {
    res.status(401).json({ message: "Only student or teacher can access list of thesis" })
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
exports.addThesis = function addThesis(req, res, validate) {
  if (req.user.role !== 'teacher') {
    res.status(401).json({ message: "You can not access to this route" });
    return;
  }
  if (req.body === undefined) {
    res.status(400).json({ message: "body is missing" });
    return;
  }

  if (!req.body.groups.includes(String(req.user.group))) {
    res.status(400).json({ message: "You are not allowed to add for this group" });
    return;
  }
  req.body.groups = [req.user.group]

  if (req.body.level === 'Master')
    req.body.level = 1;
  else
    req.body.level = 0;

  req.body.supervisor = req.user.id
  thesisService.addThesis(req.body)
    .then(response => {
      if (response.message) {
        res.status(response.status).json(response.message);
      }
      else {
        res.status(200).json(response);
      }
    })
    .catch((err) => res.status(500).json(err))
};

exports.updateThesis = function updateThesis(req, res) {
  if (req.user.role !== 'teacher') {
    res.status(401).json({ message: "You can not access to this route" })
    return;
  }
  if (!req.params.id) {
    res.status(400).json({ message: "Thesis id is not valid" })
    return
  }
  if (req.body.level === 'Master')
    req.body.level = 1;
  else
    req.body.level = 0;

  req.body.supervisor = req.user.id

  if (!req.body.groups.includes(String(req.user.group))) {
    res.status(400).json({ message: "You are not allowed to add for this group" });
    return;
  }
  req.body.groups = [req.user.group]

  // Call the updateThesis method from the thesisService
  thesisService.updateThesis(req.body, req.params.id)
    .then(response => {
      if (response.message) {
        res.status(response.status).json(response.message);
      }
      else {
        res.status(200).json(response);
      }
    })
    .catch((err) => { res.status(500).json(err) })
};

exports.deleteThesis = function deleteThesis(req, res) {
  if (req.user.role != 'teacher') {
    res.status(401).json({ message: 'only professor can delete a thesis' });
    return;
  }
  if (!req.params.id || parseInt(req.params.id) < 0) {
    res.status(400).json({ message: 'bad request: id is missing or minor than 0' });
    return;
  }
  thesisService.delete(req.params.id, req.user.id).then(response => res.status(200).json(response))
    .catch((err) => {
      if (err.message == "You can't delete this thesis, an application is already accepted")
        res.status(400).json(err);
      else
        res.status(500).json(err);
    });
}
