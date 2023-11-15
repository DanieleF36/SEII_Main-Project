const request = require("supertest");

const controller = require("../controllers/TeacherController.js");
const applicationRepository = require("../repositories/ApplicationRepository.js")
const teacherService = require("../services/TeacherService.js")

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

describe("ACCEPT APPLICATION UNIT TEST", () => {
    test("U1: Missing body", async () => {
      const mockReq = {
        body: {}
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await controller.acceptApplication(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toBeDefined();
    });
    test("U2: Invalid new status", async () => {
        const mockReq = {
            body: {
                status : 500
            }
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
      });
      test("U3: Invalid teacherId or ApplicationId", async () => {
        const mockReq = {
            body: {
                status : 1
            },
            params:{
                id_professor : 100,
                id_application : 1
            }
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const mockError = {
             error: "No rows updated. Teacher ID or Application Id not found."
        }
        jest.spyOn(teacherService, "acceptApplication").mockRejectedValue(mockError);          
        await controller.acceptApplication(mockReq, mockRes)
        await Promise.resolve()
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "No rows updated. Teacher ID or Application Id not found."})
      });
      test("U4: Application accepted or rejected correctly", async () => {
        const mockReq = {
            body: {
                status : 1
            },
            params:{
                id_professor : 1,
                id_application : 1
            }
        };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        jest.spyOn(teacherService, "acceptApplication").mockImplementationOnce(() => {
            return {
              then: function(callback) {
                callback();
                return this; // Return the same object to allow chaining
              },
              catch: function(err) {}
            };
          });          
          await controller.acceptApplication(mockReq, mockRes)
          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toBeDefined()
      });
})