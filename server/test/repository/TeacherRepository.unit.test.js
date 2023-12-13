const teacherRepository = require("../../repositories/TeacherRepository");

const db = require('../../repositories/db');
const dayjs = require('dayjs')

jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getById', ()=>{
    let teacherDB = {
        id : 1,
        name: "Gianni",
        surname : "Altobelli",
        email : "gianni@gmail.com",
        cod_group : 1,
        cod_dep : 1
    }
    let teacher = {
        id : 1,
        name: "Gianni",
        surname : "Altobelli",
        email : "gianni@gmail.com",
        codGroup : 1,
        codDep : 1
    }
    general(teacherRepository.getById,[1],teacherDB, teacher, ["Teacher ID must be greater than or equal to 0"], 'get');
})
describe('getByEmail', ()=>{
    let teacherDB = {
        id : 1,
        name: "Gianni",
        surname : "Altobelli",
        email : "gianni@gmail.com",
        code_group : 1,
        cod_dep : 1
    }
    let teacher = {
        id : 1,
        name: "Gianni",
        surname : "Altobelli",
        email : "gianni@gmail.com",
        codGroup : 1,
        codDep : 1
    }
    general(teacherRepository.getByEmail,["prova@mail.com"],teacherDB, teacher, ["Email must be provided"], 'get');
})
describe('getByNSorS', ()=>{
    general(teacherRepository.getByNSorS, ["surname"], undefined, undefined, ["Surname must be provided"], 'all')
})
describe('getIdByThesisId', ()=>{
    let sup = {
        supervisor : 1,
    }
    general(teacherRepository.getIdByThesisId, [1], sup, 1, ["Thesis ID must be greater than or equal to 0"], 'get')
})