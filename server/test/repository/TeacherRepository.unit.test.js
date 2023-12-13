const request = require("supertest");
const teacherRepository = require("../../repositories/TeacherRepository");

const db = require('../../repositories/db');

jest.mock("../../repositories/db");

beforeEach(() => {
  jest.clearAllMocks();
});


describe('findByEmail', ()=>{
    test('case0: wronged email', async ()=>{
        expect(()=>teacherRepository.findByEmail()).toThrow(new Error("email must exist"));
    }),
    test('case1: error', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(teacherRepository.findByEmail(mockId)).rejects.toEqual({error: "error SQLite"});
    }),
    test('case2: no row', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, undefined);
        });
        expect(teacherRepository.findByEmail(mockId)).resolves.toEqual({});
    }),
    test('case3: success', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, {id: 1, name: "row.name", surname:"row.surname", email:"row.email", cod_group:"row.cod_group", cod_dep:"row.cod_dep"});
        });
        expect(teacherRepository.findByEmail(mockId)).resolves.toEqual({id: 1, name: "row.name", surname:"row.surname", email:"row.email", codGroup:"row.cod_group", codDep:"row.cod_dep"});
    })
});

describe('getTeacherEmail', ()=>{
    test('case0: wrongedId', async ()=>{
        expect(()=>teacherRepository.getTeacherEmail()).toThrow(new Error("teacherID must exists and be greather than 0"));
    }),
    test('case0: wrongedId', async ()=>{
        const mockId = -1
        expect(()=>teacherRepository.getTeacherEmail(mockId)).toThrow(new Error("teacherID must exists and be greather than 0"));
    }),
    test('case1: error', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback({message: "error SQLite"},null);
        });
        expect(teacherRepository.getTeacherEmail(mockId)).rejects.toEqual({error: "error SQLite"});
    }),
    test('case2: success', async ()=>{
        const mockId = 1;
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, {email: "email"});
        });
        expect(teacherRepository.getTeacherEmail(mockId)).resolves.toEqual( "email");
    })
});