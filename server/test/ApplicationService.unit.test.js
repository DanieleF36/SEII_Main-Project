const request = require("supertest");
const applicationsService = require("../services/ApplicationService");

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
        const spyAddProposal = jest.spyOn(require("../repositories/ApplicationRepository"), "addProposal").mockRejectedValue({error: "bho1"})

        await expect(applicationsService.addProposal(mockStudentId, mockThesisId, mockCv)).rejects.toEqual({error: "bho1"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
        expect(spyAddProposal).toHaveBeenCalledWith(mockStudentId, mockThesisId, expect.any(String));
    })
    test("case3: success", async ()=>{
        const mockStudentId = 1;
        const mockThesisId = 1;
        const mockCv = {filepath:"path"};

        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(false));
        const spyAddProposal = jest.spyOn(require("../repositories/ApplicationRepository"), "addProposal").mockResolvedValue({success:"Success"})
        const mockRes = await applicationsService.addProposal(mockStudentId, mockThesisId, mockCv);
        expect(mockRes).toEqual({success:"Success"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
        expect(spyAddProposal).toHaveBeenCalledWith(mockStudentId, mockThesisId, expect.any(String));
    })
});