const repo = require('../../repositories/CoSupervisorRepository')
jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

describe('getById', ()=>{
    general(repo.getById, [1], undefined, undefined, ["Co-supervisor ID must be greater than or equal to 0"], 'get')
})