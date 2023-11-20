"use strict";
const fs=require('fs');
const applicationRepository = require("../repositories/ApplicationRepository");

/**
 * Add a new proposal
 *
 * @param {*} studentId Integer
 * @param {*} thesisId Integer
 * @param {*} cv codified file in an js object wich has at least originalFilename and filepath as propreties
 * @returns 
 * in case of succes
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
            let res = await applicationRepository.addProposal(studentId, thesisId, newPath);
            resolve(res);
          } catch (error) {
            console.log(error);
            reject(error);
          }
        }
      });
    });
  };

  /**
 * Performs queries to the database for retriving all the info about the application made by a student
 * 
 * @param {*} id_student 
 * @returns object {
          id_application: a.id_application,
          id_thesis: a.id_thesis,
          thesis_title: a.thesis_title,
          thesis_supervisor: a.thesis_supervisor,
          thesis_keywords: a.thesis_keywords,
          thesis_type: a.thesis_type,
          thesis_groups: a.thesis_groups,
          thesis_description: a.thesis_description,
          thesis_knowledge: a.thesis_knowledge,
          thesis_note: a.thesis_note,
          thesis_expiration_date: a.thesis_expiration_date,
          thesis_level: a.thesis_level,
          thesis_cds: a.thesis_cds,
          thesis_creation_date: a.thesis_creation_date,
          thesis_status: a.thesis_status,
          cosupervisor_name: a.cosupervisor_name,
          cosupervisor_surname: a.cosupervisor_surname,
          application_data: a.application_data,
          application_path_cv: a.application_path_cv,
          application_status: a.application_status,
        }
 */