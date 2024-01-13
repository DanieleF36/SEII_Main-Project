const controller = require("../../controllers/RequestController");

let mockReq;
let mockRes;

beforeEach(() => {
  mockReq = {
    body: {
        status: 1,
        request_id: 1,
        teacher_id: 1
    },
    params: {student_id: 1},
    user: {
      name: "Gianna",
      lastname: "Altobella",
      nameID: "gianni.altobelli@email.it",
      cds: "ingInf",
      cdsCode: "LM",
      role: 'secretary'
    }
  };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

describe('thesisRequestHandling', () => {
    test('Secretary user is not logged in', async () => {
        mockReq.user.role = undefined;
        controller.thesisRequestHandling(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'You can not access to this route' });
    })

    test('No student id', () => {
        mockReq.params.student_id = undefined;
        controller.thesisRequestHandling(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bad request: student id is missing or minor than 0' });
    })

    test('No status or invalid', () => {
        mockReq.body.status = undefined;
        controller.thesisRequestHandling(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Thesis status missing or invalid' });
    })

    test('No request id', () => {
        mockReq.body.request_id = undefined;
        controller.thesisRequestHandling(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Request id missing or invalid' });
    })

    test('No teacher id', () => {
        mockReq.body.teacher_id = undefined;
        controller.thesisRequestHandling(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Teacher id missing or invalid' });
    })
    test("thesisRequestHandling success", async () => {
        jest.spyOn(require('../../services/RequestService.js'), "thesisRequestHandling").mockResolvedValue("success");
        controller.thesisRequestHandling(mockReq, mockRes);
        await Promise.resolve()
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith("success");
      });
})

describe('getRequestAll', () => {
  test('Secretary user is not logged in', async () => {
      mockReq.user.role = undefined;
      controller.getRequestAll(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'You can not access to this route' });
  })

  
  test("getRequestAll success", async () => {
    jest.spyOn(require('../../services/RequestService.js'), "getRequestAll").mockResolvedValue("success");
    controller.getRequestAll(mockReq, mockRes);
    await Promise.resolve()
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith("success");
  });


  test("getRequestAll error", async () => {
    jest.spyOn(require('../../services/RequestService.js'), "getRequestAll").mockRejectedValue("error");
    controller.getRequestAll(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith("error");
  });
})

describe('getRequestsByProfessor', () => {
  test('Secretary user is not logged in', async () => {
      mockReq.user.role = undefined;
      controller.getRequestsByProfessor(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'You can not access to this route' });
  })

  
  test("getRequestsByProfessor success", async () => {
    mockReq.user.role = 'teacher'
    jest.spyOn(require('../../services/RequestService.js'), "getRequestsByProfessor").mockResolvedValue("success");
    controller.getRequestsByProfessor(mockReq, mockRes);
    await Promise.resolve()
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith("success");
  });


  test("getRequestsByProfessor error", async () => {
    mockReq.user.role = 'teacher'
    jest.spyOn(require('../../services/RequestService.js'), "getRequestsByProfessor").mockRejectedValue("error");
    controller.getRequestsByProfessor(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith("error");
  });
})