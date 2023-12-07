const request = require("supertest");

const controller = require("../../controllers/TeacherController.js");
const applicationRepository = require("../../repositories/ApplicationRepository.js")
const teacherService = require("../../services/TeacherService.js")

// jest.mock('sqlite3', () => {
//     const originalDb = jest.requireActual('sqlite3');
//     return {
//         ...originalDb,
//         all: jest.fn()
//     };
// });

beforeEach(() => {
    jest.clearAllMocks();
  });  

describe("BROWSE APPLICATION UNIT TEST", () => {
    test("U1: no supervisor's id is defined, an error should occur", async () => {
        const mockReq = {
            params: {
                id_professor: undefined
            },
            user: {
                id: 1,
                name: "Gianni",
                lastname: "Altobelli",
                nameID: "gianni.altobelli@email.it",
                role: "teacher"
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.listApplication(mockReq, mockRes)


        const jsonResponse = mockRes.json.mock.calls[0][0];
        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(jsonResponse.error).toBeDefined()
    })

    test("U2: supervisor's id is defined and a list of application is returned", async () => {
        const mockReq = {
            params: {
                id_professor: 1
            },
            user: {
                id: 1,
                name: "Gianni",
                lastname: "Altobelli",
                nameID: "gianni.altobelli@email.it",
                role: "teacher"
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


})




describe("ACCEPT APPLICATION UNIT TEST", () => {

    test("U1: Missing auth", async () => {
        const mockReq = {
          body: {},
          user: {
            role: undefined
          },
          params: {
              id_professor: 1
          }
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        await controller.browseProposals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toBeDefined();
      });


      test("U2: Incorrect response format", async () => {
        const mockReq = {
          body: {
            
          },
          user: {
              id: 1,
              name: "Gianni",
              lastname: "Altobelli",
              nameID: "gianni.altobelli@email.it",
              role: "teacher"
          },
          params: {
              id_professor: 1
          }
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        jest.spyOn(teacherService, "browseProposals").mockImplementationOnce( () => {return {status: 500, error: 'internal error'}}
        )

        // jest.spyOn(controller, "browseProposals").mockReturnThis({error: "fake error", status: 500})
        await controller.browseProposals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toBeDefined();
      });
    
      test("U3: Successfully get proposals", async () => {
        const mockReq = {
          body: {},
          user: {
              id: 1,
              name: "Gianni",
              lastname: "Altobelli",
              nameID: "gianni.altobelli@email.it",
              role: "teacher"
          },
          params: {
              id_professor: 1
          }
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        await controller.browseProposals(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toBeDefined();
      });

 })
