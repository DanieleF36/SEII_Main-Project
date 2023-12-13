const request = require("supertest");
const thesisRepository = require("../../repositories/ThesisRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");


const general = require('./generalFuncrtion').repoTest;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addThesis', () => {
    const thesis = {
        title: "New thesis is added",
        supervisor: 1,
        keywords: "SoftEng",
        type: "abroad",
        groups: "group1",
        description: "new thesis description",
        knowledge: "none",
        note: "none",
        expiration_date: "2024-01-01",
        level: 1,
        cds: "ingInf",
        creation_date: "2023-01-01",
        status: 1
    }
    const errors = [
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided"
    ]

    console.log([...Object.values(thesis)])
    general(thesisRepository.addThesis,
            [...Object.values(thesis)],
            undefined,
            {id: 1, ...thesis},
            errors,
            'run');

})

describe('getById', () => {
    const thesis = {
        title: "New thesis is added",
        supervisor: 1,
        keywords: "SoftEng",
        type: "abroad",
        groups: "group1",
        description: "new thesis description",
        knowledge: "none",
        note: "none",
        expiration_date: "2024-01-01",
        level: 1,
        cds: "ingInf",
        creation_date: "2023-01-01",
        status: 1
    }

    const errors = [
        'Thesis ID must be greater than or equal to 0',
        'Thesis ID must be greater than or equal to 0'
    ]


    general(thesisRepository.getById,
        [0],
        {success: "success"},
        undefined,
        errors,
        'get');
})

describe('getActiveBySupervisor', () => {
    const thesis = {
        title: "New thesis is added",
        supervisor: 1,
        keywords: "SoftEng",
        type: "abroad",
        groups: "group1",
        description: "new thesis description",
        knowledge: "none",
        note: "none",
        expiration_date: "2024-01-01",
        level: 1,
        cds: "ingInf",
        creation_date: "2023-01-01",
        status: 1
    }

    const errors = [
        'Supervisor ID must be greater than or equal to 0',
        'Supervisor ID must be greater than or equal to 0'
    ]

    general(thesisRepository.getActiveBySupervisor,
        [0],
        [thesis],
        [thesis],
        errors,
        'all');
})

describe('getIdByCoSupervisorId', () => {
    const thesis = {
        title: "New thesis is added",
        supervisor: 1,
        keywords: "SoftEng",
        type: "abroad",
        groups: "group1",
        description: "new thesis description",
        knowledge: "none",
        note: "none",
        expiration_date: "2024-01-01",
        level: 1,
        cds: "ingInf",
        creation_date: "2023-01-01",
        status: 1
    }

    const errors = [
        'Co-supervisor ID must be greater than or equal to 0',
        'Co-supervisor ID must be greater than or equal to 0'
    ] 

    general(thesisRepository.getIdByCoSupervisorId,
        [1],
        [thesis],
        [undefined],
        errors,
        'all');
})

describe('updateThesis', () => {
    const thesis = {
        title: "New thesis is added",
        supervisor: 1,
        keywords: "SoftEng",
        type: "abroad",
        groups: "group1",
        description: "new thesis description",
        knowledge: "none",
        note: "none",
        expiration_date: "2024-01-01",
        level: 1,
        cds: "ingInf",
        creation_date: "2023-01-01",
        status: 1
    }

    const input  = [1, ...Object.values(thesis)]
    const errors = [
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided",
        "All parameters must be provided"
    ]
    general(thesisRepository.updateThesis,
        input,
        [undefined],
        1,
        errors,
        'run');
})

describe('setStatus', () => {
    const thesis = {
        title: "New thesis is added",
        supervisor: 1,
        keywords: "SoftEng",
        type: "abroad",
        groups: "group1",
        description: "new thesis description",
        knowledge: "none",
        note: "none",
        expiration_date: "2024-01-01",
        level: 1,
        cds: "ingInf",
        creation_date: "2023-01-01",
        status: 1
    }

    const input  = [1, ...Object.values(thesis)]

    const errors = [
        '"id" must be greater than or equal to 0 and "status" must be 0 or 1 or 2',
        '"id" must be greater than or equal to 0 and "status" must be 0 or 1 or 2'
    ]
    general(thesisRepository.setStatus,
        [1, 0],
        [undefined],
        1,
        errors,
        'run');
})
