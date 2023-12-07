const applicationsService = require("../../services/ApplicationService");

beforeEach(() => {
    jest.clearAllMocks();
  });

  let mockStudentId;
  let mockThesisId;
  let mockCv;
  let mockSupervisor;

function setUpCommon1(){
    mockStudentId = 1;
    mockThesisId = 1;
    mockCv = {filepath:"path"};
    mockSupervisor = 1;
}

describe("Add Application Service", ()=>{
    beforeEach(()=>{
      setUpCommon1();
    })
    test("case1: error during moving file", async ()=>{
        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(new Error("bho")));
        await expect(applicationsService.addApplication(mockStudentId, mockThesisId, mockCv, mockSupervisor)).rejects.toEqual({error: "bho"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
    });
    test("case2: error during applicationRepository.addApplication", async ()=>{
        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(false));
        const spyAddApplication = jest.spyOn(require("../../repositories/ApplicationRepository"), "addApplication").mockRejectedValue({error: "bho1"}) 
        try {
          await applicationsService.addApplication(mockStudentId, mockThesisId, mockCv, mockSupervisor);
        }
        catch(error) {
          expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
          expect(spyAddApplication).toHaveBeenCalledWith(mockStudentId, mockThesisId, expect.any(String),mockSupervisor);
        }
    })
    test("case3: success", async ()=>{
        const spyRename = jest.spyOn(require("fs"), 'rename').mockImplementation((oldPath, newPath, cb)=> cb(false));
        const spyAddApplication = jest.spyOn(require("../../repositories/ApplicationRepository"), "addApplication").mockResolvedValue({success:"Success"})
        const mockRes = await applicationsService.addApplication(mockStudentId, mockThesisId, mockCv, mockSupervisor);
        expect(mockRes).toEqual({success:"Success"});
        expect(spyRename).toHaveBeenCalledWith(mockCv.filepath, expect.any(String), expect.any(Function));     
        expect(spyAddApplication).toHaveBeenCalledWith(mockStudentId, mockThesisId, expect.any(String), mockSupervisor);
    })
});
