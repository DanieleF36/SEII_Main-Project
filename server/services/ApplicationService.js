"use strict";
const fs = require('fs');
const applicationRepository = require("../repositories/ApplicationRepository");

/**
 * Add a new proposal
 *
 * @param {*} studentId Integer
 * @param {*} thesisId Integer
 * @param {*} cv codified file in an js object wich has at least originalFilename and filepath as propreties
 * @returns 
 * in case of success
 *  object{ applicationID: "integer",
            studentId: "integer",
            date: "string",
            status: 0,
            professorId: "integer"
          }
 * in case of error
 *  object {error: "string"}
 **/
exports.addProposal = function (studentId, thesisId, cv) {
    return new Promise((resolve, reject) => {
      //At the begginning the file is saved in tmp 
      let oldPath = cv.filepath;
      let newPath = './/file//'+ cv.originalFilename;
      //move the file from the old path to the new 
      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          reject({ error: err.message });
        } 
        else {
          try {
            let res = await applicationRepository.addApplication(studentId, thesisId, newPath);
            resolve(res);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };


