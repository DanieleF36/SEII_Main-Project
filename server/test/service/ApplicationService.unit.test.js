const request = require("supertest");
const applicationsService = require("../services/ApplicationService");
const teacherService = require("../services/TeacherService");
const thesisRepository = require("../repositories/ThesisRepository")

beforeEach(() => {
    jest.clearAllMocks();
  });

describe("add proposal", ()=>{
    test("case1: error during moving file", async ()=>{
        const mockStudentId = 1;
        const mockThesisId = 1;
        const mockCv = {filepath:"path"};

        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(new Error("bho")));

        await expect(applicationsService.addProposal(mockStudentId, mockThesisId, mockCv)).rejects.toEqual({error: "bho"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
    })
    test("case2: error during applicationRepository.addProposal", async ()=>{
        const mockStudentId = 1;
        const mockThesisId = 1;
        const mockCv = {filepath:"path"};

        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(false));
        const spyAddProposal = jest.spyOn(require("../../repositories/ApplicationRepository"), "addProposal").mockRejectedValue({error: "bho1"})

        await expect(applicationsService.addProposal(mockStudentId, mockThesisId, mockCv)).rejects.toEqual({error: "bho1"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
        expect(spyAddProposal).toHaveBeenCalledWith(mockStudentId, mockThesisId, expect.any(String));
    })
    test("case3: success", async ()=>{
        const mockStudentId = 1;
        const mockThesisId = 1;
        const mockCv = {filepath:"path"};

        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(false));
        const spyAddProposal = jest.spyOn(require("../../repositories/ApplicationRepository"), "addProposal").mockResolvedValue({success:"Success"})
        const mockRes = await applicationsService.addProposal(mockStudentId, mockThesisId, mockCv);
        expect(mockRes).toEqual({success:"Success"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
        expect(spyAddProposal).toHaveBeenCalledWith(mockStudentId, mockThesisId, expect.any(String));
    })
});
jest.mock('../repositories/ThesisRepository'); // Replace with the actual path to your thesis repository module
describe("BROWSE APPLICATION UNIT TEST", () => {
  test("A1: internal error due to invalid date", async () => {
    const mockReq = {
      
      
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  // Example: Mocking dayjs().add to add 5 seconds
  //jest.spyOn(require(controller),"browseApplication")
  const result = jest.spyOn(require(teacherService),"browseApplication").mockRejectedValue({error : "internal error"})
  expect(result.error).toHaveBeenCalledWith("internal error");
  });

//   test("U1: no supervisor's id is defined, an error should occur", async () => {
//     const mockReq = {
//         params: {
//             id_professor: undefined
//         }
//     };
//     const mockRes = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//     };

//     await controller.listApplication(mockReq, mockRes)


//     const jsonResponse = mockRes.json.mock.calls[0][0];
//     expect(mockRes.status).toHaveBeenCalledWith(400)
//     expect(jsonResponse.error).toBeDefined()
// })

  test("A2: internal error during getActiveThesis call", async () => {
    const mockSupervisor = "t123456";

    dayjs.mockReturnValueOnce({ isValid: () => true, format: () => '2023-12-01' });

    jest.spyOn(thesisRepository, "getActiveThesis").mockRejectedValue(new Error("Database error"));

    const result = await teacherService.browseApplication(mockSupervisor);

    expect(result).toEqual({ status: 500, error: 'internal error' });
  });

  test("A3: successful call to getActiveThesis", async () => {
    const mockSupervisor = "t123456";

    dayjs.mockReturnValueOnce({ isValid: () => true, format: () => '2023-12-01' });

    const successfulThesisRow = [
      {
        title: 'Thesis Title',
        supervisor: 'Supervisor Name',
        keywords: 'Keyword1, Keyword2',
        type: 'Type',
        groups: 'Group1, Group2',
        description: 'Thesis Description',
        knowledge: 'Knowledge',
        note: 'Thesis Note',
        expiration_date: '2023-12-31',
        level: 'Master',
        cds: 'Computer Science',
        creation_date: '2023-01-01',
      }
    ];

    jest.spyOn(thesisRepository, "getActiveThesis").mockResolvedValue(successfulThesisRow);

    const result = await teacherService.browseApplication(mockSupervisor);

    expect(result).toEqual(successfulThesisRow);
  });
});
