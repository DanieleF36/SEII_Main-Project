"use strict";
const fs=require('fs');
const applicationRepository = require('../repositories/ApplicationRepository')

/**
 * Performs queries to the database for retriving all the info about the application made by a student
 * 
 * @param {*} id_student 
 * @returns an array of objects defined as
 * {
 *  title: string,
 *  supervisor_name: string,
 *  supervisor_surname: string,
 *  keywords: array of string,
 *  type: array of string,
 *  groups: array of string,
 *  description: string,
 *  knowledge: array of string,
 *  note: string,
 *  expiration_date: string,
 *  level: integer,
 *  cds: array of string,
 *  application_data: string,
 *  path_cv: string,
 *  status: integer,(this is application status) 
 * }
 */
exports.browserApplicationStudent = async function (id_student) {
    const result = await applicationRepository.browserApplicationStudent(id_student)
    return result
};