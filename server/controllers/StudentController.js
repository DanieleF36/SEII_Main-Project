'use strict';

const ser = require('../services/StudentService');

exports.prova = async () => {
  const a = await ser.prova();
  return a;
};