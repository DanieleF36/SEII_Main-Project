const controller = require('../../controllers/StudentController.js');

let mockReq;
let mockRes

beforeEach(() => {
  mockReq = {
    body: {},
    params: {},
    user: {
      name: "Gianna",
      lastname: "Altobella",
      nameID: "gianni.altobelli@email.it",
      cds: "ingInf",
      cdsCode: "LM"
    }
  };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

describe('Browse application', ()=> {
  test('case1: user differt from student', async () => {
    mockReq.user.role = "wrong role"
    await controller.browserApplicationStudent(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({error:"You can not access to this route"});
  });
  test('case2: Unauthorized', async ()=>{
    mockReq.user.role = "student"
    mockReq.user.id = 1;
    mockReq.params.id_student = 2;
    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockResolvedValue({succes:"success"})
    await controller.browserApplicationStudent(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({error:"Unauthorized"});
  });
  test('case3: internal error', async ()=>{
    mockReq.user.role = "student"
    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockRejectedValue({error:"error"})
    await controller.browserApplicationStudent(mockReq, mockRes);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'error' });
  });
  test('case4: Success', async ()=>{
    mockReq.user.role = "student"
    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockResolvedValue(true)
    await controller.browserApplicationStudent(mockReq, mockRes);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toBeDefined()
  })
});