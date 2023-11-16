const request = require("supertest");
const controller = require("../controllers/ThesisController");
const thesisService = require('../services/ThesisService.js')

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
    expect(mockRes.json).toHaveBeenCalledWith({ error: "body is missing" });
  });

  test("U2: Supervisor is missing", async () => {
    const mockReq = {
      body: {
        level : "Master"
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "supervisor is missing" });
  });

  test("U3: Expiration date is missing", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        level : "Master"
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "expiration date is missing or not valid" });
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
    expect(mockRes.json).toHaveBeenCalledWith({ error: "level value not recognized" });
  });

  test("U5: Status value is not recognized or allowed", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        level: "Master",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "status value not recognized or allowed" });
  });

  test("U6: Cosupervisor is not an array", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status : 1,
        level: "Master",
        cosupervisor: "Paperino"
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "cosupervisor is not an array" });
  });

  test("U7: Keywords is not an array", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status : 1,
        level: "Master",
        cosupervisor: ["Paperino","Pluto"],
        keywords: "not good"
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "keywords value not recognized" });
  });

  test("U8: Type value not recognized", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status : 1,
        level: "Master",
        cosupervisor: ["Paperino","Pluto"],
        keywords: ["good","now"]
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "type value not recognized" });
  });

  test("U9: New thesis proposal is inserted correctly", async () => {
      const mockReq = {
        body: {
          supervisor: "Pippo",
          expiration_date: "2015-01-01",
          status : 1,
          level: "Master",
          cosupervisor: ["Paperino","Pluto"],
          keywords: ["good","now"],
          type : ["Abroad"]
        },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(thesisService, "addThesis").mockResolvedValue(true);          
      await controller.addThesis(mockReq, mockRes)
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toBeDefined()
  });
});

describe('SEARCH PROPOSAL UNIT TEST', () => {
    test('U1: no page number is given so an error occurs', async () => {
        const mockReq = {
            query: {
                page: undefined
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U2: given page number is negative so an error occurs', async () => {
        const mockReq = {
            query: {
                page: undefined
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U3: title is an array or contains SLQ keywords(not a string)', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: ["title1", "title2"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U4: title is an array or contains SLQ keywords(not a string)', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "SELECT * FROM Thesis"
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U5: title is longer than 30', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "Caffeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U6: supervisor is an array', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: ["Cool supervisor", "Another one"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U7: groups is an array instead of a string', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: "Cool supervisor",
                keywords: ["Sw", "hw"],
                groups: ["DEP1", "DEP2"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U8: knowledge is an array instead of a string', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: "Cool supervisor",
                keywords: ["Sw", "hw"],
                groups: "DEP1",
                knowledge: ["1st", "2nd", "3rd"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U9: knowledge is an array instead of a string', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: "Cool supervisor",
                keywords: ["Sw", "hw"],
                groups: "DEP1",
                knowledge: ["1st", "2nd", "3rd"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U10: expiration_date is an array instead of a string', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: "Cool supervisor",
                keywords: ["Sw", "hw"],
                groups: "DEP1",
                knowledge: "C programming",
                expiration_date: ["01", "01", "2030"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U11: cds is an array instead of a string', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: "Cool supervisor",
                keywords: ["Sw", "hw"],
                groups: "DEP1",
                knowledge: "C programming",
                expiration_date: "2030-01-01",
                cds: ["LM32", "LM31"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U12: creationg_date is an array instead of a string', async () => {
        const mockReq = {
            query: {
                page: 1,
                order: "titleD",
                title: "thesis title",
                supervisor: "Cool supervisor",
                keywords: ["Sw", "hw"],
                groups: "DEP1",
                knowledge: "C programming",
                expiration_date: "2030-01-01",
                cds: "LM32",
                creation_date: ["01", "01", "2030"]
            }
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toBeDefined();
    })
    test('U13: query is performed', async () => {
        const mockReq = {
            query: {
                page: 1
            }
        };

        const com_thesis = {
            title: "title",
            supervisor: "t123456",
            keywords: "sw,hw",
            type: "abroad",
            groups: "DAUIN",
            knowledge: "none",
            expiration_date: "2030-01-01"
          }
        jest.spyOn(thesisService, "advancedResearchThesis").mockImplementationOnce(() => {
            return {
              then: function(callback) {
                callback([
                  [
                    com_thesis
                  ],
                  1
                ]);
              }
            };
          });
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.advancedResearchThesis(mockReq, mockRes)

        const jsonResponse = mockRes.json.mock.calls[0][0];
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(jsonResponse.nPage).toBe(1);
        expect(Array.isArray(jsonResponse.thesis)).toBe(true)
        expect(jsonResponse.thesis).toEqual([com_thesis])

    })
})