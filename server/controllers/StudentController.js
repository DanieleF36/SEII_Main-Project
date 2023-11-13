"use strict";
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const applicationsService = require("../services/ApplicationService");


/**
 * wrapper function for apply to a thesis proposal with id = id_thesis 
 * @param {*} req in req.params.id_thesis there is an iteger for the thesis
 *                in req.body.cv there is the cv in a PDF form
 * @param {*} res the returned object is defined as follow:
 * {
 *   id: integer,
 *   id_student: integer,
 *   id_thesis: integer,
 *   date: string,
 *   cv: {
 *     cv: //TODO
 *     }
 *   }
 */
exports.applyForProposal = async function (req, res, next) {
  if (!req.body) {
    return res.status(400).json({ error: "Body is missing" });
  }
  console.log("StudentController")
  if (/* studentId != null && */ req.params.id_thesis != null) {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const file = files.cv[0]; 
      if(!file)
        return res.status(400).json({ error: "Missing required parameters" });    
      applicationsService.addProposal(1, req.params.id_thesis, file)
      .then(function (response) {
        console.log(JSON.stringify(response));
        return res.status(201).json(response);
      })
      .catch(function (response) {
        res.status(404).json(response);
      });
    })
  } else {
    return res.status(400).json({ error: "Missing required parameters" });
  }
 
};