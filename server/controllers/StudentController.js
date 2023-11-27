"use strict";
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const applicationsService = require("../services/ApplicationService");
const studentsService = require("../services/StudentService");

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
exports.applyForProposal = function (req, res, next) {
  if(req.user.role!=='student'){
    res.status(401).send({error:"You can not access to this route"})
    return;
  }
  if (!req.body) {
    return res.status(400).json({ error: "Body is missing" });
  }
  if (/* studentId != null && */ req.params.id_thesis != null) {
    //Initializes an object that is used to handle the input file in the multipart/form-data format 
    const form = new formidable.IncomingForm();
    //Translate the file into a js object and call it files
    form.parse(req, function (err, fields, files) {
      if(err)
        return res.status(500).json({error:"Internal Error"});
      if(!files.cv || !files.cv[0])
        return res.status(400).json({ error: "Missing file" });
      if(files.cv.length>1){
          return res.status(400).json({ error: "Multiple Files" });
        }
      const file = files.cv[0];
      applicationsService.addProposal(1, req.params.id_thesis, file)
      .then(function (response) {
        return res.status(201).json(response);
      })
      .catch(function (response) {
        if(response.error != "Not found"){
          return res.status(500).json({error:"Internal Error"});
        }
        else
          return res.status(404).json(response);
      });
    })
  } else {
    return res.status(400).json({ error: "Missing required parameters" });
  }
 
};

exports.browserApplicationStudent = function (req, res) {
  if(req.user.role!=='student'){
    res.status(401).send({error:"You can not access to this route"})
    return;
  }
  console.log(req.params.id_student)
  studentsService.browserApplicationStudent(req.params.id_student)
  .then(function (response) {
    return res.status(200).json(response);
  })
  .catch(function (response) {
    return res.status(500).json(response);
  })
}