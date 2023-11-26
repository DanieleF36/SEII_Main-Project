const request = require("supertest");
const studentRepository = require("../../repositories/StudentRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

beforeEach(() => {
  jest.clearAllMocks();
});

describe('browserApplicationStudent', ()=>{
    test('case1: success', async ()=>{
        const mockIdStudent = 1; 
        mockRow = {
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
    }),
    test('case2: error', async () => {
        const mockError = new Error("sql error");
        db.all.mockImplementation((sql, params, callback) => {
            callback(mockError, null);
        });
    
        await expect(studentRepository.browserApplicationStudent('mockStudentId')).rejects.toThrow(mockError);

    })
})