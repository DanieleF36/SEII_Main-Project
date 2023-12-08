const request = require("supertest");
const studentRepository = require("../../repositories/StudentRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

beforeEach(() => {
  jest.clearAllMocks();
});

describe.skip('browserApplicationStudent', ()=>{
    test('case1: success', async ()=>{
        const mockIdStudent = 1; 
        const mockRow = {
            title: "title",
            supervisor_name: "supervisor_name",
            supervisor_surname: "supervisor_surname",
            status: "status",
            type: "type",
            groups: "groups",
            description: "description",
            knowledge: "knowledge",
            note: "note",
            level: "level",
            keywords: "keywords",
            expiration_date: "expiration_date",
            cds: "cds",
            path_cv: "path_cv",
            application_data: "application_data",
        }
        db.all.mockImplementation((sql, params, callback) => {
            callback(null, [mockRow]);
        });
        const mockRes = await studentRepository.browserApplicationStudent(mockIdStudent);
        await Promise.resolve();
        expect(mockRes).toEqual([mockRow]);
    })
    test('case2: error', async () => {
        const mockError = new Error("sql error");
        db.all.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });
    
        await expect(studentRepository.browserApplicationStudent('mockStudentId')).rejects.toThrow(mockError);

    })
})

describe.skip('getStudentEmailCancelled', ()=>{
    test('case0: wrongedId', async ()=>{
        expect(()=>studentRepository.getStudentEmailCancelled()).toThrow(new Error("id_student must exists and be greater than 0"));
    })
    test('case0: wrongedId', async ()=>{
        const mockId = -1
        expect(()=>studentRepository.getStudentEmailCancelled(mockId)).toThrow(new Error("id_student must exists and be greater than 0"));
    })
    test('case1: error', async ()=>{
        const mockId = 1;
        db.all.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(studentRepository.getStudentEmailCancelled(mockId)).rejects.toEqual({error: "error SQLite"});
    })
    test('case2: success', async ()=>{
        const mockId = 1;
        db.all.mockImplementation((sql, params, callback) => {
            callback(null, [{email: "email0"}, {email: "email1"}, {email: "email2"}]);
        });
        expect(studentRepository.getStudentEmailCancelled(mockId)).resolves.toEqual( ["email0", "email1", "email2"]);
    })
});

describe.skip('getStudentEmail', ()=>{
    test('case0: wrongedId', async ()=>{
        expect(()=>studentRepository.getStudentEmail()).toThrow(new Error("id_student must exists and be greater than 0"));
    })
    test('case0: wrongedId', async ()=>{
        const mockId = -1
        expect(()=>studentRepository.getStudentEmail(mockId)).toThrow(new Error("id_student must exists and be greater than 0"));
    })
    test('case1: error', async ()=>{
        const mockId = 1;
        db.all.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(studentRepository.getStudentEmail(mockId)).rejects.toEqual({error: "error SQLite"});
    })
    test('case2: success', async ()=>{
        const mockId = 1;
        db.all.mockImplementation((sql, params, callback) => {
            callback(null, {email: "email0"});
        });
        expect(studentRepository.getStudentEmail(mockId)).resolves.toEqual( "email0");
    })
});
