const controller = require("../../controllers/ApplicationController.js");
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

function isSuccessful(status) {
    return (status == 200 || status == 201)
}
function isFailure(status, error) {
    return ((status == 400 || status == 401 || status == 500) && error !== undefined);
}

afterEach(() => {
    // Clean up or reset any modifications made during the test
    mockReq = null;
    mockRes = null;
});

describe('List Application', () => {
    test('case1: role undefined', async () => {
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "You can't access to this route. You're not a student or a professor" });
    });
    test('case2: teacher: userId not valid', async () => {
        mockReq.user.role = 'teacher';
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Given supervisor's id is not valid" });
    });
    test('case3: teacher: browseApplicationProfessor err', async () => {
        mockReq.user.id = 1;
        mockReq.user.role = 'teacher';
        const spy = jest.spyOn(require('../../services/TeacherService.js'), 'browseApplicationProfessor').mockRejectedValue({ error: "error" });
        await controller.listApplication(mockReq, mockRes);
        await Promise.resolve();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "error" });
        expect(spy).toHaveBeenCalledWith(1);
    });
    test('case4: teacher: browseApplicationProfessor success', async () => {
        mockReq.user.id = 1;
        mockReq.user.role = 'teacher';
        const spy = jest.spyOn(require('../../services/TeacherService.js'), 'browseApplicationProfessor').mockResolvedValue({ success: "success" });
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: "success" });
        expect(spy).toHaveBeenCalledWith(1);
    });
    test('case5: student: userId not valid', async () => {
        mockReq.user.role = 'student';
        mockReq.user.id = undefined;
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Given student's id is not valid" });
    });
    test('case6: student: browserApplicationStudent err', async () => {
        mockReq.user.role = 'student';
        mockReq.user.id = 1;
        const spy = jest.spyOn(require('../../services/StudentService.js'), 'browserApplicationStudent').mockRejectedValue({ error: "error" });
        await controller.listApplication(mockReq, mockRes);
        await Promise.resolve();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "error" });
        expect(spy).toHaveBeenCalledWith(1);
    });
    test('case7: student: browserApplicationStudent success', async () => {
        mockReq.user.role = 'student';
        mockReq.user.id = 1;
        const spy = jest.spyOn(require('../../services/StudentService.js'), 'browserApplicationStudent').mockResolvedValue({ success: "success" });
        await controller.listApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: "success" });
        expect(spy).toHaveBeenCalledWith(1);
    });
})

describe('Apply for proposal', () => {
    test('Case1: Wrong role', async () => {
        mockReq.user.role = 'wrong role';
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case2: Body is missing', async () => {
        mockReq.user.role = 'student';
        mockReq.body = undefined;
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case3: Application for another thesis already send', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "cv.pdf";
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockImplementation(() => ["123"]);
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case4: Supervisor not found', async () => {
        mockReq.body = "cv.pdf";
        mockReq.user.role = 'student';
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockImplementation(() => undefined);
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case5: Missing required parameters', async () => {
        mockReq.body = "cv.pdf";
        mockReq.user.role = 'student';
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case6: error during file parsing (Internal error)', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "cv.pdf";
        mockReq.params = { id_thesis: 1 };
        // Simulate an error during the file parsing
        const mockForm = {
            parse: jest.fn((req, callback) => callback(new Error('Internal Error'))),
        };
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case7: Missing file error', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "cv.pdf";
        mockReq.params = { id_thesis: 1 };
        // Simulate that the file is missing
        const mockForm = {
            parse: jest.fn((req, callback) => callback(null, {}, {})),
        };
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case8: Multiple file error', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "cv.pdf";
        mockReq.params = { id_thesis: 1 };
        // Simulate multiple file
        const mockForm = {
            parse: jest.fn((req, callback) => callback(null, {}, { cv: [{}, {}] })),
        };
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
        await controller.applyForProposal(mockReq, mockRes);
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case9: Success', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "cv.pdf";
        mockReq.params = { id_thesis: 1 };
        const mockForm = {
            parse: jest.fn((req, callback) => {
                callback(null, {}, { cv: [{}] });
            }),
        };
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
        jest.spyOn(require("../../services/ApplicationService"), "addApplication").mockResolvedValue(true)
        await controller.applyForProposal(mockReq, mockRes);
        expect(isSuccessful(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case10: student and thesisId must be grater than 0', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "cv.pdf";
        mockReq.params = { id_thesis: -1 };
        const mockForm = {
            parse: jest.fn((req, callback) => {
                callback(null, {}, { cv: [{}] });
            }),
        };
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
        jest.spyOn(require("../../services/ApplicationService"), "addApplication").mockRejectedValue({ error: "student and theis's id must exist and be greater than 0" })
        await controller.applyForProposal(mockReq, mockRes);
        await Promise.resolve();
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
    test('Case11: path_cv must exists', async () => {
        mockReq.user.role = 'student';
        mockReq.body = "notcv.pdf";
        mockReq.params = { id_thesis: 1 };
        const mockForm = {
            parse: jest.fn((req, callback) => {
                callback(null, {}, { cv: [{}] });
            }),
        };
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getActiveByStudentId").mockResolvedValue(undefined);
        jest.spyOn(require("../../repositories/TeacherRepository"), "getIdByThesisId").mockResolvedValue(true);
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
        jest.spyOn(require("../../services/ApplicationService"), "addApplication").mockRejectedValue({ error: "path_cv must exists" })
        await controller.applyForProposal(mockReq, mockRes);
        await Promise.resolve();
        expect(isFailure(mockRes.status.mock.calls, mockRes.json.mock.calls[0][0])).toBe(true);
    });
});

describe("Accept Application", () => {
    test('U0: user role different from teacher', async () => {
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "You can not access to this route" });
    });
    test('U1: application id missing', async () => {
        mockReq.user.role = 'teacher';
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Wronged id application" });
    });
    test('U3: application id wronged', async () => {
        mockReq.user.role = 'teacher';
        mockReq.params.id_application = -1;
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Wronged id application" });
    });
    test("U4: Missing body", async () => {
        mockReq.user.role = 'teacher';
        mockReq.params.id_application = 1;
        mockReq.body= undefined;
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Body is missing" });
    });
    test("U5: Missing new status acceptApplication", async () => {
        mockReq.user.role = 'teacher';
        mockReq.params.id_application = 1;
        mockReq.body.status = undefined;
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Missing new status acceptApplication" });
    });
    test("U6: Invalid new status", async () => {
        mockReq.user.role = 'teacher';
        mockReq.params.id_application = 1;
        mockReq.body.status = 5;
        await controller.acceptApplication(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid new status entered" });
    });
    test("U7: Application accepted or rejected fails with error", async () => {
        mockReq.user.role = 'teacher';
        mockReq.params.id_application = 1;
        mockReq.body.status = 1;
        jest.spyOn(require("../../services/TeacherService.js"), "acceptApplication").mockRejectedValue({ error: "error" });
        await controller.acceptApplication(mockReq, mockRes);
        await Promise.resolve();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "error" })
    });
    test("U8: Application accepted or rejected correctly", async () => {
        mockReq.user.role = 'teacher';
        mockReq.params.id_application = 1;
        mockReq.body.status = 1;
        jest.spyOn(require("../../services/TeacherService.js"), "acceptApplication").mockResolvedValue(true);
        await controller.acceptApplication(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toBeDefined()
    });
})