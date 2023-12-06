const request = require("supertest");
const controller = require("../../controllers/ThesisController.js");
const thesisService = require('../../services/ThesisService.js')

let mockReq; 
let mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}; 

beforeEach(() => {
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };   
});

describe.skip("INSERT PROPOSAL UNIT TEST", () => {
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
  //Magari questo può essere spostato fuori ma deve essere resettato tra describe e non tra test
  mockReq = { 
    body: undefined,
    query: undefined,
    user: {
      id: 1,
      name: "Gianna",
      lastname: "Altobella",
      nameID: "gianni.altobelli@email.it",
      cds: "ingInf",
      cdsCode: "LM"
    }  
  };
  let mockValidate = jest.fn();
  test('case 1: role not present', async () => {
    
    await controller.searchThesis(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Only student or teacher can access list of thesis"});
  }),
  test('case2: role student: validate return error', async()=>{
    mockReq.user.role = 'student';
    const { ValidationError } = require('express-json-validator-middleware');
    mockValidate.mockImplementation((req, res, callback) => {
      callback(new ValidationError('error'));
    });
    await controller.searchThesis(mockReq, mockRes, mockValidate);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({error: "error"});
  }),
  test('case3: role student: error in thesis service', async()=>{
    mockReq.query = {};
    mockReq.query.order = "titleD";
    mockReq.query.page = 1;
    mockValidate.mockImplementation((req, res, callback) => {
      callback(null);
    });
    jest.spyOn(require('../../services/ThesisService.js'), 'advancedResearchThesis').mockRejectedValue({error: 'error'});
    await controller.searchThesis(mockReq, mockRes, mockValidate);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: "error"});
  }),
  test('case4: role student: success', async()=>{
    mockValidate.mockImplementation((req, res, callback) => {
      callback(null);
    });
    jest.spyOn(require('../../services/ThesisService.js'), 'advancedResearchThesis').mockResolvedValue([[{success: 'success', supervisor:{name:"name", surname:"surname"}}], 0]);
    await controller.searchThesis(mockReq, mockRes, mockValidate);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({nPage:0, thesis:[{success: 'success', supervisor:"name surname"}]});
  }),
  test('case5: role teacher: error', async()=>{
    mockReq.user.role = 'teacher';
    jest.spyOn(require('../../services/ThesisService.js'), 'getActiveBySupervisor').mockRejectedValue({error: 'error'});
    await controller.searchThesis(mockReq, mockRes);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: 'error'});
  }),
  test('case6: role teacher: success', async()=>{
    mockReq.user.role = 'teacher';
    jest.spyOn(require('../../services/ThesisService.js'), 'getActiveBySupervisor').mockResolvedValue({success: 'success'});
    await controller.searchThesis(mockReq, mockRes);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({nPage:1, thesis:{success: 'success'}});
  })
})

describe.skip("UPDATE PROPOSAL UNIT TEST", () => {
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