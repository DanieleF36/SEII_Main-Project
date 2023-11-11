const request = require("supertest");
const controller = require("../controllers/ThesisController");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("INSERT PROPOSAL UNIT TEST", () => {
  test("U1: Missing body", async () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toBeDefined();
  });

  test("U2: Supervisor is missing", async () => {
    const mockReq = {
      body: {},
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toBeDefined();
  });

  test("U3: Expiration date is missing", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toBeDefined();
  });

  test("U4: Level value is not recognized", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toBeDefined();
  });

  test("U5: Status value is not recognized or allowed", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        level: 1,
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toBeDefined();
  });

  test.skip("U5: New thesis proposal is inserted correctly", async () => {
    const test_thesis = [
      {
        title: "prova",
        supervisor: "Pippo",
        keywords: "prima prova",
        type: "sperimentale",
        groups: "back-end",
        description: "test tesi",
        knowledge: "test knowledge",
        note: "test note",
        expiration_date: "2053-1-1",
        level: 1,
        cds: "test cds",
        creation_date: "2050-1-1",
        status: 0,
      },
    ];

    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        level: 1,
        status: 1,
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Use await here to wait for the asynchronous operation to complete
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toBeDefined();
  });
});
