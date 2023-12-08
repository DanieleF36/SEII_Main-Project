const controller = require("../../controllers/CoSupervisorController.js");
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

describe('getAllCoSupervisorsEmails', () => {
  test("case1: role != teacher", async () => {
    mockReq.user.role = 'student';
    await controller.getAllCoSupervisorsEmails(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Only teacher can access to this API" });
  });
  test("case2: getAllCoSupervisorsEmailsService err", async () => {
    mockReq.user.role = 'teacher';
    jest.spyOn(require('../../services/CoSupervisorService'), "getAllCoSupervisorsEmailsService").mockRejectedValue({ message: "error" });
    await controller.getAllCoSupervisorsEmails(mockReq, mockRes);
    await Promise.resolve()
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
  test("case3: getAllCoSupervisorsEmailsService success", async () => {
    mockReq.user.role = 'teacher';
    jest.spyOn(require('../../services/CoSupervisorService.js'), "getAllCoSupervisorsEmailsService").mockResolvedValue({ data: "success" });
    await controller.getAllCoSupervisorsEmails(mockReq, mockRes);
    await Promise.resolve()
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith("success");
  });
})