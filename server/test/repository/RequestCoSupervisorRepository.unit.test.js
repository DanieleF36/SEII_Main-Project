const repo = require('../../repositories/RequestCoSupervisorRepository')
const general = require('./generalFuncrtion').repoTest;

jest.mock("../../repositories/db");
beforeEach(() => {
    jest.clearAllMocks();
});

describe("addCoSupervisor", ()=>{
    general(repo.addCoSupervisor, [1,1,1],undefined, 1,["Request id must be defined and greater or equal to 0", "coSupervisorId must be defined", "teacherId must be defined and greater or equal to 0"], "run" )
});