const request = require("supertest");
const studentController = require("../controllers/StudentController");

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Apply for proposal', () => {
    test('Case1: body is missing', async() => {
      const mockReq = { body: null };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await studentController.applyForProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Body is missing' });
    });
  
    test('Case2: missing required parameters', async() => {
      const mockReq = { body: {}, params: { id_thesis: null } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await studentController.applyForProposal(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing required parameters' });
    });
  
    test('Case3: error during file parsing', async() => {
      const mockReq = { body: {}, params: { id_thesis: 1 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
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
      const mockReq = { body: {}, params: { id_thesis: 1 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
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
      const mockReq = { body: {}, params: { id_thesis: 1 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
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
        // Mocking the Express request and response objects
        const req = {
            body: {  },
            params: { id_thesis: 123 },
          };
      
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
        // Mocking the form object and its parse method
        const mockForm = {
          parse: jest.fn((req, callback) => {callback(null,  {}, { cv: [{  }]  });
          }),
        };
        
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    
        // Mocking the addProposal method in applicationsService
        jest.spyOn(require("../services/ApplicationService"), "addProposal").mockResolvedValue({succes:"success"})
    
        await studentController.applyForProposal(req, res);
        // Verifying that the response is as expected
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({succes:"success"});
      });
  
    test('Case7: idThesis not found', async () => {
      const mockReq = { body: {}, params: { id_thesis: 1 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Simulate a not found
      jest.spyOn(require("../services/ApplicationService"), "addProposal").mockRejectedValue({ error: 'Not found' })
      
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
      const mockReq = { body: {}, params: { id_thesis: 1 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Simulate any error
      jest.spyOn(require("../services/ApplicationService"), "addProposal").mockRejectedValue({ error: 'bho' })
      
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
})
