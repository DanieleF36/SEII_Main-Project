const request = require("supertest");
const studentRepository = require("../../repositories/StudentRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

beforeEach(() => {
  jest.clearAllMocks();
});

describe('acceptApplication', ()=>{
    test('case1: fetchThesisStudentQuery error', async ()=>{
        const mockIdStudent = 1;
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