const request = require("supertest");
const controller = require("../../controllers/ThesisController.js");
const thesisService = require('../../services/ThesisService.js')

beforeEach(() => {
  jest.clearAllMocks();
});

describe("INSERT PROPOSAL UNIT TEST", () => {
  test("U1: Missing body", async () => {
    const mockReq = {
      body: undefined,
      user: {
            id: 1,
            name: "Gianni",
            lastname: "Altobelli",
            nameID: "gianni.altobelli@email.it",
            role: "teacher"
        }
    };
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
      user: {
        role: undefined
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "You can not access to this route" });
  });

  test("U3: Expiration date is missing", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        level : "Master"
      },
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
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
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
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
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
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
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
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
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
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
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "type value not recognized" });
  });

  test("U9: Title missing or empty string", async () => {
    const mockReq = {
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: ["Paperino", "Pluto"],
        keywords: ["good", "now"],
        type: ["New type"],
        groups: ['group1'],
        cds: ['cds1'],
        knowledge: ['none']
      },
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.addThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Title missing or empty string" });
  });

  test("U10: New thesis proposal is inserted correctly", async () => {
      const mockReq = {
        body: {
          title : "New Thesis Title",
          supervisor: "Pippo",
          cosupervisor: [''],
          expiration_date: "2015-01-01",
          status : 1,
          level: "Master",
          cosupervisor: ["Paperino","Pluto"],
          keywords: ["good","now"],
          type : ["Abroad"],
          groups: ['group1'],
          cds: ['cds1'],
          knowledge: ['none']
        },
        user: {
          id: 1,
          name: "Gianni",
          lastname: "Altobelli",
          nameID: "gianni.altobelli@email.it",
          role: "teacher"
        }
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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
            },
            user: {
              id: 1,
              name: "Gianna",
              lastname: "Altobella",
              nameID: "gianni.altobelli@email.it",
              role: "student",
              cds: "ingInf"
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

describe("UPDATE PROPOSAL UNIT TEST", () => {
  test("U1: Missing thesis id", async () => {
    const mockReq = {
      params: {},
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Thesis id is not valid" });
  });
  test("U2: Missing body", async () => {
    const mockReq = {
      params: { id: 1 },
      body: undefined,
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "body is missing" });
  });

  test("U3: Supervisor is missing", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        level: "Master"
      },
      user: {
        role: undefined
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "You can not access to this route" });
  });

  test("U4: Expiration date is missing", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        level: "Master"
      },
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "expiration date is missing or not valid" });
  });

  test("U5: Level value is not recognized", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "level value not recognized" });
  });

  test("U6: Status value is not recognized or allowed", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        level: "Master",
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "status value not recognized or allowed" });
  });

  test("U7: Cosupervisor is not an array", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: "Paperino"
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "cosupervisor is not an array" });
  });

  test("U8: Keywords is not an array", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: ["Paperino", "Pluto"],
        keywords: "not good"
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "keywords value not recognized" });
  });

  test("U9: Type value not recognized", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: ["Paperino", "Pluto"],
        keywords: ["good", "now"]
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.updateThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "type value not recognized" });
  });

  test("U10: New thesis title missing or empty string", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        supervisor: "Pippo",
        cosupervisor: [''],
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: ["Paperino", "Pluto"],
        keywords: ["good", "now"],
        type: ["Abroad"],
        groups: ['group1'],
        cds: ['cds1'],
        knowledge: ['none']
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(thesisService, "updateThesis").mockResolvedValue(true);
    await controller.updateThesis(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Title missing or empty string" });
  });

  test("U11: ThesisId not found", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        title: "New thesis title",
        supervisor: "Pippo",
        cosupervisor: [''],
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: ["Paperino", "Pluto"],
        keywords: ["good", "now"],
        type: ["Abroad"],
        groups: ['group1'],
        cds: ['cds1'],
        knowledge: ['none']
      },
      user: {
        id: 1,
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(thesisService, "updateThesis").mockImplementation(async () => {
      return Promise.reject({ error: "No rows updated. Thesis ID not found." });
    });
    await expect(controller.updateThesis(mockReq)).rejects.toEqual({ error: "No rows updated. Thesis ID not found." });
  });


  test("U12: New thesis proposal is inserted correctly", async () => {
    const mockReq = {
      params: { id: 1 },
      body: {
        title: "New thesis title",
        supervisor: "Pippo",
        cosupervisor: [''],
        expiration_date: "2015-01-01",
        status: 1,
        level: "Master",
        cosupervisor: ["Paperino", "Pluto"],
        keywords: ["good", "now"],
        type: ["Abroad"],
        groups: ['group1'],
        cds: ['cds1'],
        knowledge: ['none']
      },
      user: {
        name: "Gianni",
        lastname: "Altobelli",
        nameID: "gianni.altobelli@email.it",
        role: "teacher"
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(thesisService, "updateThesis").mockResolvedValue(true);
    await controller.updateThesis(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toBeDefined()
  });
});