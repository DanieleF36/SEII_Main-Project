"use strict";
const fs=require('fs');
const studentRepository = require("../repositories/StudentRepository");

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
exports.browserApplicationStudent = async function (id_student) {
    console.log("SERVICE")
    let res = await studentRepository.browserApplicationStudent(id_student);
    return res;
  };