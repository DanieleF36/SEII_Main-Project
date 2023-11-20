"use strict";
const fs=require('fs');
const studentRepository = require("../repositories/StudentRepository");

exports.browserApplicationStudent = async function (id_student) {
    console.log("SERVICE")
    let res = await studentRepository.browserApplicationStudent(id_student);
    return res;
  };