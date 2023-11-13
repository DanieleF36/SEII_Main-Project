const request = require("supertest");

const controller = require("../controllers/TeacherController.js");
const applicationRepository = require("../repositories/ApplicationRepository.js")
const teacherService = require("../services/TeacherService.js")
const sqlite = require('sqlite3')

// jest.mock('sqlite3', () => {
//     const originalDb = jest.requireActual('sqlite3');
//     return {
//         ...originalDb,
//         all: jest.fn()
//     };
// });

describe("BROWSE APPLICATION UNIT TEST", () => {
    test("U1: no supervisor's id is defined, an error should occur", async () => {
        const mockReq = {
            params: {
                id_professor: undefined
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.listApplication(mockReq, mockRes)


        const jsonResponse = mockRes.json.mock.calls[0][0];
        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(jsonResponse.error).toBeDefined()
    })

    test("U2: supervisor's id is defineda and a list of application is returned", async () => {
        const mockReq = {
            params: {
                id_professor: "t123456"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const successfulApplicationRow = [
            {
                id: 1,
                id_student: 101,
                id_thesis: 201,
                data: 'Some data',
                path_cv: '/path/to/cv',
                status: 'Pending'
            }
        ];
        const successfulStudentRow = [
            {
                id: 101,
                surname: 'Doe',
                name: 'John'
            }
        ];
        const successfulThesisRow = [
            {
                id: 201,
                title: 'Thesis Title',
                cds: 'Computer Science'
            }
        ];

        jest.spyOn(teacherService, "listApplication").mockResolvedValue( 
            {
                thesis: successfulThesisRow,
                student: successfulStudentRow,
                application: successfulApplicationRow
            }
        )

        await controller.listApplication(mockReq, mockRes)

        const jsonResponse = mockRes.json.mock.calls[0][0];
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(jsonResponse.thesis).toEqual(successfulThesisRow)
        expect(jsonResponse.student).toEqual(successfulStudentRow)
        expect(jsonResponse.application).toEqual(successfulApplicationRow)
    })

    test.skip("TODO: managing async calls to sqlite database ", async () => {
        const mockReq = {
            params: {
                id_professor: "t123456"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const successfulApplicationRow = [
            {
                id: 1,
                id_student: 101,
                id_thesis: 201,
                data: 'Some data',
                path_cv: '/path/to/cv',
                status: 'Pending'
            }
        ];

        const successfulStudentRow = [
            {
                id: 101,
                surname: 'Doe',
                name: 'John'
            }
        ];

        const successfulThesisRow = [
            {
                id: 201,
                title: 'Thesis Title',
                cds: 'Computer Science'
            }
        ];

        console.log(sqlite.Database)
        jest.spyOn(sqlite, "all").mockResolvedValueOnce(() => {
            return successfulThesisRow
        })

        jest.spyOn(sqlite, "all").mockResolvedValueOnce(() => {
            return successfulStudentRow
        })

        jest.spyOn(sqlite, "all").mockResolvedValueOnce(() => {
            return successfulApplicationRow
        })



        await controller.listApplication(mockReq, mockRes)

        const jsonResponse = mockRes.json.mock.calls[0][0];
        console.log(jsonResponse)        
        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(jsonResponse.error).toBeDefined()
    })

})