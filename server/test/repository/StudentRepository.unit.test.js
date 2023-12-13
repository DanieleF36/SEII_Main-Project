const studentRepository = require("../../repositories/StudentRepository");

const db = require('../../repositories/db');
const dayjs = require('dayjs')

jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getById', () => {
    let student = {
        id: 1,
        name: "Gianni",
        surname: "Altobelli",
        gender: 1,
        nationality: "IT",
        email: "gianni@gmail.com",
        cod_degree: 1,
        enrol_year: 1
    }
    general(studentRepository.getById, [1], student, student, ["Student ID must be greater than or equal to 0"], 'get');
})
describe('getByEmail', () => {
    let student = {
        id: 1,
        name: "Gianni",
        surname: "Altobelli",
        gender: 1,
        nationality: "IT",
        email: "gianni@gmail.com",
        cod_degree: 1,
        enrol_year: 1
    }
    general(studentRepository.getByEmail, [1], student, student, ["Email must be provided"], 'get');
})
describe('getStudentEmailCancelled', () => {
    let valuedb = [{ email : "protected@gmail.com" }];
    let value = ["protected@gmail.com"]
    general(studentRepository.getStudentEmailCancelled, [1,1], valuedb, value, ["Application ID must be greater than or equal to 0","Thesis ID must be greater than or equal to 0"], 'all');
})
describe('getStudentAndCDSByEmail', () => {
    let valueDb = {
        id: 1,
        name: "Gianni",
        surname: "Altobelli",
        gender: 1,
        nationality: "IT",
        email: "gianni@gmail.com",
        title : "Title",
        code : 1,
        enrol_year: 1,
    }
    let value = {
        id: 1,
        name: "Gianni",
        surname: "Altobelli",
        email: "gianni@gmail.com",
        gender: 1,
        nationality: "IT",
        cdsCode: 1,
        cds: "Title",
        enrol_year: 1,
    }
    general(studentRepository.getStudentAndCDSByEmail, ["prova@gmail.com"], valueDb, value, ["Email must be provided"], 'get');
})
describe('getCareerByStudentId', () => {
    let valueDb = {
        title_course : "Grosso esame",
        grade : 30
    }
    let value = {
        title_course : "Grosso esame",
        grade : 30
    }
    general(studentRepository.getCareerByStudentId, [1], valueDb, value, ["Id student must be provided"], 'all');
})