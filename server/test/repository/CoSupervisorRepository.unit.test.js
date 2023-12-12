const repo = require('../../repositories/CoSupervisorRepository')
jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

describe('getById', ()=>{
    general(repo.getById, [1], undefined, undefined, ["Co-supervisor ID must be greater than or equal to 0"], 'get')
})

describe('getByThesisId', ()=>{
    general(repo.getByThesisId, [1], undefined, undefined, ["Thesis ID must be greater than or equal to 0"], 'all')
})

describe('getByEmail', ()=>{
    general(repo.getByEmail, ["email"], undefined, undefined, ["Email must be provided"], 'get')
})

describe('getByNSorS', ()=>{
    general(repo.getByNSorS, ["surname"], undefined, undefined, ["Surname must be provided"], 'all')
})

describe('getByNSorS', ()=>{
    general(repo.getAllEmails, [], [{email:"email1"},{email:"email2"}], ["email1", "email2"], [], 'all')
})