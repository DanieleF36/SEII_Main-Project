const controller = require("../../controllers/SupervisorController.js");
let mockReq;
let mockRes;

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

describe('getAllSupervisorsEmails', () => {
  test("case1: getAllSupervisorsEmailsService err", async () => {
    jest.spyOn(require('../../services/TeacherService.js'), "getAllSupervisorsEmailsService").mockRejectedValue({ error: "error" });
    controller.getAllSupervisorsEmails(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
  test("case2: getAllSupervisorsEmailsService success", async () => {
    jest.spyOn(require('../../services/TeacherService.js'), "getAllSupervisorsEmailsService").mockResolvedValue("success");
    controller.getAllSupervisorsEmails(mockReq, mockRes);
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith("success");
  });
})