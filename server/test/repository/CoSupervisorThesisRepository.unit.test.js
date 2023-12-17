const repository = require("../../repositories/CoSupervisorThesisRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

beforeEach(() => {
  jest.clearAllMocks();
});
describe('addCosupervisorThesis', () => {
    const errors = [
        'IDs must be greater than or equal to 0',
        'IDs must be greater than or equal to 0',
        'IDs must be greater than or equal to 0'
    ]

    general(repository.addCoSupervisorThesis,
        [1, 2, 3],
        undefined,
        true,
        errors,
        'run');
})

describe('getIdsByThesisId', () => {
    const errors = [
        'Thesis ID must be greater than or equal to 0'
    ]

    general(repository.getIdsByThesisId,
        [1],
        [{id_teacher: 1, id_cosupervisor: 0}],
        [{idTeacher: 1}],
        errors,
        'all');
})