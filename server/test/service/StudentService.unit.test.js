const request = require("supertest");
const studentService = require("../../services/StudentService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe('browserApplicationStudent', ()=>{
    test('case1: success', async ()=>{
        const mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "browserApplicationStudent").mockResolvedValue({success:"success"})
    
        const mockRes = await studentService.browserApplicationStudent(mockIdStudent);
        await Promise.resolve();
        expect(mockRes).toEqual({success:"success"});
      }),
      test('case2: error', async ()=>{
        const mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "browserApplicationStudent").mockRejectedValue({error:"error"})
    
        const mockRes = await studentService.browserApplicationStudent(mockIdStudent);
        await Promise.resolve();
        expect(mockRes).toEqual({error:"error"});
      })
})