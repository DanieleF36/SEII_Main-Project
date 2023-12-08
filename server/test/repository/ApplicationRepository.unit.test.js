
const request = require("supertest");
const applicationRepository = require("../../repositories/ApplicationRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

beforeEach(() => {
  jest.clearAllMocks();
});


describe.skip('getApplication', ()=>{
    test('case-1: wrongedId', async ()=>{
        expect(()=>applicationRepository.getApplication()).toThrow(new Error("id must exists and be greater than 0"));
    })
    test('case0: wrongedId', async ()=>{
        const mockId = -1;
        expect(()=>applicationRepository.getApplication(mockId)).toThrow(new Error("id must exists and be greater than 0"));
    })
    test('case1: error', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(applicationRepository.getApplication(mockId)).rejects.toEqual({error: "error SQLite"});
    })
    test('case2: success', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, {success: "success"});
        });
        expect(applicationRepository.getApplication(mockId)).resolves.toEqual({success: "success"});
    })
});

describe.skip('updateStatus', ()=>{
    test('case-2: wrongedId', async()=>{
        const mockId = undefined, mockStatus = 0;
        expect(()=>applicationRepository.updateStatus(mockId, mockStatus)).toThrow(new Error("id must exists and be greater than 0"));
    })
    test('case-1: wrongedStatus', async()=>{
        const mockId = 0, mockStatus = undefined;
        expect(()=>applicationRepository.updateStatus(mockId, mockStatus)).toThrow(new Error("id must exists and be greater than 0"));
    })
    test('case0: wrongedId', async()=>{
        const mockId = -1, mockStatus = 0;
        expect(()=>applicationRepository.updateStatus(mockId, mockStatus)).toThrow(new Error("id must exists and be greater than 0"));
    })
    test('case1: status < 0', async()=>{
        const mockId = 1, mockStatus = -1;
        expect(()=>applicationRepository.updateStatus(mockId, mockStatus)).toThrow(new Error("status must exists and be one or two or three"));
    })
    test('case2: status > 3', async()=>{
        const mockId = 1, mockStatus = 4;
        expect(()=>applicationRepository.updateStatus(mockId, mockStatus)).toThrow(new Error("status must exists and be one or two or three"));
    })
    test('case3: error', async ()=>{
        const mockId = 1, mockStatus = 3;
        db.run.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(applicationRepository.updateStatus(mockId, mockStatus)).rejects.toEqual({error: "error SQLite"});
    })
    test('case4: success', async ()=>{
        const mockId = 1, mockStatus = 3;
        db.run.mockImplementation((sql, params, callback) => {
            callback(null);
        });
        const updatedId = await applicationRepository.updateStatus(mockId, mockStatus);
        expect(updatedId).toBe("Done");
    })
});

describe.skip('updateStatusToCancelledForOtherStudent', ()=>{
    test('case-1: wrongedIdThesis', async()=>{
        const mockIdThesis = undefined, mockIdStudent = 0;
        expect(()=>applicationRepository.updateStatusToCancelledForOtherStudent(mockIdThesis, mockIdStudent)).toThrow(new Error("id_thesis must exists and be greater than 0"));
    })
    test('case0: wrongedIdThesis', async()=>{
        const mockIdThesis = -1, mockIdStudent = 0;
        expect(()=>applicationRepository.updateStatusToCancelledForOtherStudent(mockIdThesis, mockIdStudent)).toThrow(new Error("id_thesis must exists and be greater than 0"));
    })
    test('case1: wrongedIdStudent', async()=>{
        const mockIdThesis = 1, mockIdStudent = undefined;
        expect(()=>applicationRepository.updateStatusToCancelledForOtherStudent(mockIdThesis, mockIdStudent)).toThrow(new Error("id_student must exists and be greater than 0"));
    })
    test('case2: wrongedIdStudent', async()=>{
        const mockIdThesis = 1, mockIdStudent = -1;
        expect(()=>applicationRepository.updateStatusToCancelledForOtherStudent(mockIdThesis, mockIdStudent)).toThrow(new Error("id_student must exists and be greater than 0"));
    })
    test('case3: error', async ()=>{
        const mockIdThesis = 1, mockIdStudent = 1;
        db.run.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(applicationRepository.updateStatusToCancelledForOtherStudent(mockIdThesis, mockIdStudent)).rejects.toEqual({error: "error SQLite"});
    })
    test('case4: success', async ()=>{
        const mockIdThesis = 1, mockIdStudent = 1;
        db.run.mockImplementation((sql, params, callback) => {
            callback(null);
        });
        expect(applicationRepository.updateStatusToCancelledForOtherStudent(mockIdThesis, mockIdStudent)).resolves.toEqual("Done");
    })
})
