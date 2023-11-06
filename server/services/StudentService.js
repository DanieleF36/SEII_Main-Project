'use strict';

const repo = require('../repositories/StudentRepository');

exports.prova = () => {
    return new Promise(async (resolve, reject) => {
        const a = await repo.prova();
        resolve(a);
    })
};