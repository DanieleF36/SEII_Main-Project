"use strict";
const fs=require('fs');
const applicationRepository = require("../repositories/ApplicationRepository");

/**
 * Add a new proposal
 *
 * @param {*} studentId Integer
 * @param {*} thesisId Integer
 * @param {*} cv file
 * @returns 
 * in case of succes
 *  object{}
 * in case of error
 *  object {error: string}
 **/
exports.addProposal = function (studentId, thesisId, cv) {
    return new Promise((resolve, reject) => {
      let oldPath = cv.filepath;
      let newPath = 'C:\\Users\\danie\\Desktop\\provs\\' + cv.originalFilename;
  
      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          reject({ error: err.message });
        } else {
          try {
            let res = await applicationRepository.addProposal(studentId, thesisId, newPath);
            resolve(res);
          } catch (error) {
            reject({ error: error.message });
          }
        }
      });
    });
  };