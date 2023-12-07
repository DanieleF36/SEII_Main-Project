const request = require("supertest");
const thesisRepository = require("../../repositories/ThesisRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

beforeEach(() => {
  jest.clearAllMocks();
});

describe.skip('setStatus', ()=>{
    test('case0: wrongedId', async()=>{
        const mockId = undefined, mockStatus = 0;
        expect(()=>thesisRepository.setStatus(mockId, mockStatus)).toThrow(new Error("id must exists and be greater than 0"));
    }),
    test('case1: wrongedId', async()=>{
        const mockId = -1, mockStatus = 0;
        expect(()=>thesisRepository.setStatus(mockId, mockStatus)).toThrow(new Error("id must exists and be greater than 0"));
    }),
    test('case2: wrongedStatus', async()=>{
        const mockId = 0, mockStatus = undefined;
        expect(()=>thesisRepository.setStatus(mockId, mockStatus)).toThrow(new Error("id must exists and be greater than 0"));
    }),
    test('case3: status < 0', async()=>{
        const mockId = 1, mockStatus = -1;
        expect(()=>thesisRepository.setStatus(mockId, mockStatus)).toThrow(new Error("status must exists and be one or two or three"));
    }),
    test('case4: status > 3', async()=>{
        const mockId = 1, mockStatus = 4;
        expect(()=>thesisRepository.setStatus(mockId, mockStatus)).toThrow(new Error("status must exists and be one or two or three"));
    }),
    test('case5: error', async ()=>{
        const mockId = 1, mockStatus = 3;
        db.run.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"});
        });
        expect(thesisRepository.setStatus(mockId, mockStatus)).rejects.toEqual({error: "error SQLite"});
    }),
    test('case6: No changes', async ()=>{
        const mockId = 1, mockStatus = 3;
        db.run.mockImplementationOnce((sql, params, callback) => {
            callback.call({changes:0}, null);
        });
        expect(thesisRepository.setStatus(mockId, mockStatus)).rejects.toEqual({ error: "No rows updated. Thesis ID not found." });
    }),
    test('case7: success', async ()=>{
        const mockId = 1, mockStatus = 3;
        db.run.mockImplementation((sql, params, callback) => {
            callback.call({changes:1}, null);
        });
        const updatedId = await thesisRepository.setStatus(mockId, mockStatus);
        expect(updatedId).toBe("Done");
    })
})

describe.skip('getThesisTitle', ()=>{
    test('case0: wrongedId', async ()=>{
        expect(()=>thesisRepository.getThesisTitle()).toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case0: wrongedId', async ()=>{
        const mockId = -1
        expect(()=>thesisRepository.getThesisTitle(mockId)).toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case1: error', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(thesisRepository.getThesisTitle(mockId)).rejects.toEqual({error: "error SQLite"});
    }),
    test('case2: success', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, {title: "title"});
        });
        expect(thesisRepository.getThesisTitle(mockId)).resolves.toEqual( "title");
    })
});