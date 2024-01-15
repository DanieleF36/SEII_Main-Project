const controller = require("../../controllers/RequestController.js");
const requestRepository = require("../../repositories/RequestRepository");
const applicationRepository = require('../../repositories/ApplicationRepository.js')
const requestService = require('../../services/RequestService.js')

let mockReq;
let mockRes;

beforeEach(() => {
  mockReq = {
    body: {},
    params: {},
    user: {
      name: "Gianna",
      id_student: 3,
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

describe('addRequest', () => {
  test("case1: role != student", async () => {
    mockReq.user = 'teacher';
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Only student can access to this API" });
  });

  test("case2: student already has an active application", async () => {
    mockReq.user = 'student';
    mockReq.params = { id_thesis: 1 };
    
    jest.spyOn(applicationRepository, 'getActiveByStudentId').mockResolvedValue(true);
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "You already have an application for a thesis" });
  });

  test("case3: student already has an active application", async () => {
    mockReq.user = 'student';
    mockReq.params = { id_thesis: 1 };
    
    jest.spyOn(applicationRepository, 'getActiveByStudentId').mockResolvedValue(undefined);
    jest.spyOn(requestRepository, 'getActiveByStudentId').mockResolvedValue(true);
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "You already have done a request for a new thesis" });
  });

  test("case4: Success", async () => {
    mockReq.user = 'student';
    mockReq.params = { id_thesis: 1 };
    
    jest.spyOn(applicationRepository, 'getActiveByStudentId').mockResolvedValue(undefined);
    jest.spyOn(requestRepository, 'getActiveByStudentId').mockResolvedValue(undefined);
    jest.spyOn(requestService, 'addRequest').mockResolvedValue(true);
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("case5: Internal server error", async () => {
    mockReq.user = 'student';
    mockReq.params = { id_thesis: 1 };
    
    jest.spyOn(applicationRepository, 'getActiveByStudentId').mockResolvedValue(undefined);
    jest.spyOn(requestRepository, 'getActiveByStudentId').mockRejectedValue({ message: "Internal server error" });
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  test("case6: Internal server error", async () => {
    mockReq.user = 'student';
    mockReq.params = { id_thesis: 1 };
    
    jest.spyOn(applicationRepository, 'getActiveByStudentId').mockRejectedValue({ message: "Internal server error" });
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});

describe('professorThesisHandling', () => {
  test("case1: invalid role", () => {
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'You can not access this route' });
  });

  test("case2: missing request_id", () => {
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = null;
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Request id missing or invalid" });
  });

  test("case3: invalid request_id", () => {
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = -1;
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Request id missing or invalid" });
  });

  test("case4: missing or invalid statusTeacher", () => {
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = 1;
    mockReq.body.statusTeacher = null;
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Thesis status (statusTeacher) missing or invalid' });
  });

  test("case4: missing or invalid statusTeacher", () => {
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = 1;
    mockReq.body.statusTeacher = -1;
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Thesis status (statusTeacher) missing or invalid' });
  });

  test("case4: missing or invalid statusTeacher", () => {
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = 1;
    mockReq.body.statusTeacher = 4;
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Thesis status (statusTeacher) missing or invalid' });
  });

  test("case5: valid request", async () => {
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = 1;
    mockReq.body.statusTeacher = 1;
    
    jest.spyOn(requestService, 'professorThesisHandling').mockResolvedValue(true);
    controller.professorThesisHandling(mockReq, mockRes);

    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});

