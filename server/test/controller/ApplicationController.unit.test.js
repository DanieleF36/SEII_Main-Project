const controller = require("../../controllers/ApplicationController.js");
let mockReq; 
let mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}; 

beforeEach(() => {
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };   
});
describe('List Application', ()=>{
    mockReq = { 
        body: undefined,
        query: undefined,
        user: {
          name: "Gianna",
          lastname: "Altobella",
          nameID: "gianni.altobelli@email.it",
          cds: "ingInf",
          cdsCode: "LM"
        }  
    };
    test('case1: role undefined', async()=>{
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({error: "You can't access to this route. You're not a student or a professor"});
    }),
    test('case2: teacher: userId not valid', async()=>{
        mockReq.user.role = 'teacher';
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Given supervisor's id is not valid"});
    }),
    test('case3: teacher: browseApplicationProfessor err', async()=>{
        mockReq.user.id = 1;
        const spy = jest.spyOn(require('../../services/TeacherService.js'), 'browseApplicationProfessor').mockRejectedValue({error: "error"});
        await controller.listApplication(mockReq, mockRes);
        await Promise.resolve();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "error"});
        expect(spy).toHaveBeenCalledWith(1);
    }),
    test('case4: teacher: browseApplicationProfessor success', async()=>{
        const spy = jest.spyOn(require('../../services/TeacherService.js'), 'browseApplicationProfessor').mockResolvedValue({success: "success"});
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({success: "success"});
        expect(spy).toHaveBeenCalledWith(1);
    }),
    test('case5: student: userId not valid', async()=>{
        mockReq.user.role = 'student';
        mockReq.user.id = undefined;
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Given student's id is not valid"});
    }),
    test('case6: student: browserApplicationStudent err', async()=>{
        mockReq.user.role = 'student';
        mockReq.user.id = 1;
        const spy = jest.spyOn(require('../../services/StudentService.js'), 'browserApplicationStudent').mockRejectedValue({error: "error"});
        await controller.listApplication(mockReq, mockRes);
        await Promise.resolve();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "error"});
        expect(spy).toHaveBeenCalledWith(1);
    }),
    test('case7: student: browserApplicationStudent success', async()=>{
        mockReq.user.role = 'student';
        mockReq.user.id = 1;
        const spy = jest.spyOn(require('../../services/StudentService.js'), 'browserApplicationStudent').mockResolvedValue({success: "success"});
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({success: "success"});
        expect(spy).toHaveBeenCalledWith(1);
    })    
})