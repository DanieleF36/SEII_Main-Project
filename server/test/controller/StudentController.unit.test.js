const request = require("supertest");
const studentController = require("../../controllers/StudentController");
// beforeEach(() => {
//   jest.clearAllMocks();
// });

let mockReq;
let mockRes

function setupCommon1() {
  mockReq = {
    body: {},
    params: {},
    user: {
      id: 1,
      name: "Gianna",
      lastname: "Altobella",
      nameID: "gianni.altobelli@email.it",
      role: "student",
      cds: "ingInf"
    }
  };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function isSuccessful(status, response) {
  return (status == 200 || status == 201)
}
function isFailure(status, error) {
  return ((status == 400 || status == 401 || status == 500) && error !== undefined);
}

describe('Apply for proposal', () => {
  beforeEach(() => {
    setupCommon1()
  });
  afterEach(() => {
    // Clean up or reset any modifications made during the test
    mockReq = null;
    mockRes = null;
  });
  test('Case1: Wrong role', async () => {
    mockReq.user.role = 'wrong role';
    await studentController.applyForProposal(mockReq, mockRes);
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case2: Body is missing', async () => {
    mockReq.body = undefined;
    await studentController.applyForProposal(mockReq, mockRes);
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case3: Application for another thesis already send', async () => {
    mockReq.body = "cv.pdf";
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockImplementation(() => ["123"]);
    await studentController.applyForProposal(mockReq, mockRes);
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case4: Supervisor not found', async () => {
    mockReq.body = "cv.pdf";
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockImplementation(() => undefined);
    await studentController.applyForProposal(mockReq, mockRes);
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case5: Missing required parameters', async () => {
    mockReq.body = "cv.pdf";
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    await studentController.applyForProposal(mockReq, mockRes);
    console.log(mockRes.json.mock.calls[0][0])
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case6: error during file parsing (Internal error)', async() => {
    mockReq.params= { id_thesis: 1 };
    // Simulate an error during the file parsing
    const mockForm = {
      parse: jest.fn((req, callback) => callback(new Error('Internal Error'))),
    };
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    await studentController.applyForProposal(mockReq, mockRes);
    console.log(mockRes.json.mock.calls[0][0])
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case7: Missing file error', async() => {
    mockReq.params= { id_thesis: 1 };
    // Simulate that the file is missing
    const mockForm = {
      parse: jest.fn((req, callback) => callback(null, {}, {})),
    };
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    await studentController.applyForProposal(mockReq, mockRes);
    console.log(mockRes.json.mock.calls[0][0])
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case8: Multiple file error', async() => {
    mockReq.params= { id_thesis: 1 };
    // Simulate multiple file
    const mockForm = {
      parse: jest.fn((req, callback) => callback(null, {}, {cv:[{},{}]})),
    };
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    await studentController.applyForProposal(mockReq, mockRes);
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case9: Success', async() => {
    mockReq.params= { id_thesis: 1 };
    const mockForm = {
      parse: jest.fn((req, callback) => {callback(null,  {}, { cv: [{  }]  });
      }),
    };
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    jest.spyOn(require("../../repositories/ApplicationRepository"), "addApplication").mockResolvedValue(true)
    await studentController.applyForProposal(mockReq, mockRes);
    expect(isSuccessful(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case10: student and thesisId must be grater than 0', async() => {
    mockReq.params= { id_thesis: -1 };
    const mockForm = {
      parse: jest.fn((req, callback) => {callback(null,  {}, { cv: [{  }]  });
      }),
    };
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    jest.spyOn(require("../../repositories/ApplicationRepository"), "addApplication").mockRejectedValue({error: "student and theis's id must exist and be greater than 0"})
    await studentController.applyForProposal(mockReq, mockRes);
    await Promise.resolve();
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
  test('Case11: path_cv must exists', async() => {
    mockReq.params= { id_thesis: 1 };
    const mockForm = {
      parse: jest.fn((req, callback) => {callback(null,  {}, { cv: [{  }]  });
      }),
    };
    jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    jest.spyOn(require("../../repositories/ApplicationRepository"), "addApplication").mockRejectedValue({error: "path_cv must exists"})
    await studentController.applyForProposal(mockReq, mockRes);
    await Promise.resolve();
    expect(isFailure(mockRes.status.mock.calls,mockRes.json.mock.calls[0][0])).toBe(true);
  });
});

describe.skip('Browse application', ()=> {
  test('case1: user differt from student', async ()=>{
    const mockReq = {
      user:{role:'professor'}
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await studentController.browserApplicationStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  }),
  test('case2: ok', async ()=>{
    const mockReq = {
      user: {
        id: 1,
        name: "Gianna",
        lastname: "Altobella",
        nameID: "gianni.altobelli@email.it",
        role: "student",
        cds: "ingInf"
      },
      params: {
        id_student: 1
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockResolvedValue({succes:"success"})

    await studentController.browserApplicationStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ succes:"success" });
  }),
  test('case3: internal error', async ()=>{
    const mockReq = {
      user: {
        id: 1,
        name: "Gianna",
        lastname: "Altobella",
        nameID: "gianni.altobelli@email.it",
        role: "student",
        cds: "ingInf"
      },
      params: {
        id_student: 1
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockRejectedValue({error:"error"})

    await studentController.browserApplicationStudent(mockReq, mockRes);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'error' });
  })
});