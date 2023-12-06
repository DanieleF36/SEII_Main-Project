const request = require("supertest");
const studentController = require("../../controllers/StudentController");

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


describe('Apply for proposal', () => {
  //Magari questo può essere spostato fuori ma deve essere resettato tra describe e non tra test
  mockReq = { 
    body: undefined,
    user: {
      id: 1,
      name: "Gianna",
      lastname: "Altobella",
      nameID: "gianni.altobelli@email.it",
      role: "student",
      cds: "ingInf",
      cdsCode: "LM"
    }  
  };
  test('Case1: body is missing', async() => {    
      await studentController.applyForProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Body is missing' });
    });
  
    test('Case2: missing required parameters', async() => {
      mockReq.body = {};
  
      await studentController.applyForProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing required parameters' });
    });
  
    test('Case3: error during file parsing', async() => {
      mockReq.params = { id_thesis: 1 };
      // Simulate an error during the file parsing
      const mockForm = {
        parse: jest.fn((req, callback) => callback(new Error('Internal Error'))),
      };
      jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
  
      await studentController.applyForProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Error' });
    });

    test('Case4: file is missing in the request', async() => {
      // Simulate that the file is missing
      const mockForm = {
        parse: jest.fn((req, callback) => callback(null, {}, {})),
      };
      jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
  
      await studentController.applyForProposal(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing file' });
    });
    
    test('Case5: Multiple Files', async () => { 
      const mockForm = {
        parse: jest.fn((req, callback) => callback(null, {}, {cv:[{},{}]})),
      };
      jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    
      await studentController.applyForProposal(mockReq, mockRes);
    
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Multiple Files' });
    });

    const applicationsService = {
        addProposal: jest.fn(),  // Creazione di un mock per la funzione addProposal
    };
  
    test('Case6: success', async () => {
        // Mocking the form object and its parse method
        const mockForm = {
          parse: jest.fn((req, callback) => {callback(null,  {}, { cv: [{  }]  });
          }),
        };
        
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    
        // Mocking the addProposal method in applicationsService
        jest.spyOn(require("../../services/ApplicationService"), "addProposal").mockResolvedValue({succes:"success"})
    
        await studentController.applyForProposal(mockReq, mockRes);
        // Verifying that the response is as expected
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({succes:"success"});
      });
  
    test('Case7: idThesis not found', async () => {
      // Simulate a not found
      jest.spyOn(require("../../services/ApplicationService"), "addProposal").mockRejectedValue({ error: 'Not found' })
      
      const mockForm = {
        parse: jest.fn((req, callback) => callback(null, {}, { cv: [{}] })),
      };
      jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
      // Simula che il file sia presente nella richiesta
      await studentController.applyForProposal(mockReq, mockRes);
      await Promise.resolve();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({error:"Not found"});
    });

    test('Case8: internal error inside addProposal', async () => {  
      // Simulate any error
      jest.spyOn(require("../../services/ApplicationService"), "addProposal").mockRejectedValue({ error: 'bho' })
      
      const mockForm = {
        parse: jest.fn((req, callback) => callback(null, {}, { cv: [{}] })),
      };
      jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
      // Simula che il file sia presente nella richiesta
      await studentController.applyForProposal(mockReq, mockRes);
      await Promise.resolve();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({error:"Internal Error"});
    });
});

describe.skip('Browse application', ()=> {
  test('case1: user differt from student', async ()=>{
    const mockReq = {
      user:{role:'professor'}
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await studentController.browserApplicationStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  }),
  test('case2: ok', async ()=>{
    const mockReq = {
      user: {
        id: 1,
        name: "Gianna",
        lastname: "Altobella",
        nameID: "gianni.altobelli@email.it",
        role: "student",
        cds: "ingInf"
      },
      params: {
        id_student: 1
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockResolvedValue({succes:"success"})

    await studentController.browserApplicationStudent(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ succes:"success" });
  }),
  test('case3: internal error', async ()=>{
    const mockReq = {
      user: {
        id: 1,
        name: "Gianna",
        lastname: "Altobella",
        nameID: "gianni.altobelli@email.it",
        role: "student",
        cds: "ingInf"
      },
      params: {
        id_student: 1
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(require("../../services/StudentService"), "browserApplicationStudent").mockRejectedValue({error:"error"})

    await studentController.browserApplicationStudent(mockReq, mockRes);
    await Promise.resolve();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'error' });
  })
});