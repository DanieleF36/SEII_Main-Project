const controller = require("../../controllers/RequestController.js");
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
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Only student can access to this API" });
  });

  test("case2: student already has an active application", async () => {
    mockReq.user = 'student';
    mockReq.body = "cv.pdf";
    mockReq.params = { id_thesis: 1 };
    jest.spyOn(require("../../repositories/ApplicationRepository"), 'getActiveByStudentId').mockResolvedValue(["3"]);
    // jest.spyOn(require("../../services/RequestService"), 'addRequest').mockResolvedValue(true);
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "You already have an application for a thesis" });
  });

  // test("case2: addRequest err", async () => {
  //   mockReq.user.role = 'student';
  //   jest.spyOn(require('../../services/RequestController.js'), "addRequest").mockRejectedValue({ error: "error" });
  //   controller.addRequest(mockReq, mockRes);
  //   await new Promise(resolve => setImmediate(resolve));
  //   expect(mockRes.status).toHaveBeenCalledWith(500);
  //   expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
  // });
  test("case3: addRequest success", async () => {
    mockReq.user.role = 'student';
    jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
    jest.spyOn(require("../../services/RequestService"), 'addRequest').mockResolvedValue(undefined);
    controller.addRequest(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith("success");
  });
});

describe('professorThesisHandling', () => {
  test("case1: invalid role", () => {
     // Change the role to simulate an invalid role
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
    mockReq.body.statusTeacher = null; // Change statusTeacher to simulate a missing or invalid statusTeacher
    controller.professorThesisHandling(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Thesis status (statusTeacher) missing or invalid' });
  });

  test("case4: valid request", async () => {
    // Mock the requestService.professorThesisHandling function to resolve with a response
    mockReq.user.role = 'teacher';
    mockReq.body.request_id = 1;
    mockReq.body.statusTeacher = 1;

    controller.professorThesisHandling(mockReq, mockRes);

    await new Promise(resolve => setImmediate(resolve));

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(1);

    // expect(requestService.professorThesisHandling).toHaveBeenCalledWith(1, 2);
  });
});

