
const applicationRepository = require("../../repositories/ApplicationRepository");

const db = require('../../repositories/db');
const dayjs = require('dayjs')

jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addApplication', ()=>{
    general(applicationRepository.addApplication,[1, 1, "undefined", 1],undefined, {applicationID:1, date:dayjs().format('YYYY-MM-DD').toString(), status:0, studentId:1,professorId:1}, ["Student or thesis or supervisor IDs must exist and be greater than 0", "Student or thesis or supervisor IDs must exist and be greater than 0","CV path must exist" , "Student or thesis or supervisor IDs must exist and be greater than 0"], 'run');
})

describe('getByStudentId', ()=>{
    const application = [{
        id_application: 1,
        title: "a.title",
        supervisor_name: "a.supervisor_name",
        supervisor_surname: "a.supervisor_surname",
        status: 0,
        type: "a.type",
        groups: "a.groups",
        description: "a.description", 
        knowledge: "a.knowledge",
        note: "a.note",
        level: 0,
        keywords: "a.keywords",
        expiration_date: "a.expiration_date",
        cds: "a.cds",
        path_cv: "a.path_cv",
        application_data: "a.application_data",
    }]
    general(applicationRepository.getByStudentId,[1],application, application, ["Student ID must be greater than or equal to 0"], 'all');
})

describe('getById', ()=>{
    general(applicationRepository.getById,[1],undefined, undefined, ["Application ID must be greater than or equal to 0"], 'get');
})

describe('getActiveByStudentId', ()=>{
    general(applicationRepository.getActiveByStudentId,[1],undefined, undefined, ["Student ID must be greater than or equal to 0"], 'get');
})

describe('getByTeacherId', ()=>{
    const applications = [{
        id_student: 1,
        id_application: 1,
        id_thesis: 1,
        title: "a.title",
        name: "a.name",
        surname: "a.surname",
        data: "a.data",
        path_cv: "a.path_cv",
        status: "a.status"
      }];
      const applicationsDb = [{
        id_student: 1,
        id: 1,
        id_thesis: 1,
        title: "a.title",
        name: "a.name",
        surname: "a.surname",
        data: "a.data",
        path_cv: "a.path_cv",
        status: "a.status"
      }];
    general(applicationRepository.getByTeacherId,[1],applicationsDb, applications, ["Teacher ID must be greater than or equal to 0"], 'all');
})

describe('getAcceptedByThesisId', ()=>{
    general(applicationRepository.getAcceptedByThesisId,[1],undefined, undefined, ["Thesis ID must be greater than or equal to 0"], 'get');
})

describe('updateStatus', ()=>{
    general(applicationRepository.updateStatus,[1,0],undefined, undefined, ["Application ID must be greater than or equal to 0", "Status must be an integer between 0 and 3 (rejected, pending, accepted, or cancelled)"], 'run', true, "No rows updated. Thesis ID not found.");
})

describe('updateStatusToCancelledForOtherStudent', ()=>{
    general(applicationRepository.updateStatusToCancelledForOtherStudent,[1,1],undefined, undefined, ["Thesis ID must be greater than or equal to 0", "Student ID must be greater than or equal to 0"], 'run', true, "No rows updated. Thesis ID not found.");
})
