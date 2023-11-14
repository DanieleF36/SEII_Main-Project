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
      console.log("4 "+JSON.stringify(mockRes));
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing file' });
    });

    const applicationsService = {
        addProposal: jest.fn(),  // Creazione di un mock per la funzione addProposal
    };
  
    it('Case5: success', async () => {
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
          parse: jest.fn((req, callback) => {callback(null,  {}, { cv: [{ /* mock file details */ }]  });
          }),
        };
        
        jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
    
        // Mocking the addProposal method in applicationsService
        applicationsService.addProposal.mockResolvedValue({ /* mock success response */ });
    
        studentController.applyForProposal(req, res);
        console.log("res "+JSON.stringify(res));
        // Verifying that the response is as expected
        expect(res.status).toHaveBeenCalledWith(201);
        //expect(res.json).toHaveBeenCalledWith(/* expected success response */);
      });
  
    test('Case6: idThesis not found', async () => {
      const mockReq = { body: {}, params: { id_thesis: 1 } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Simulate a not found
      applicationsService.addProposal.mockRejectedValue({ error: 'Not found' });
      const mockForm = {
        parse: jest.fn((req, callback) => callback(null, {}, { cv: [{}] })),
      };
      jest.spyOn(require('formidable'), 'IncomingForm').mockImplementation(() => mockForm);
      // Simula che il file sia presente nella richiesta
      await studentController.applyForProposal(mockReq, mockRes);

    });

    test('Case7: Multiple Files', async () => {
        const mockReq = { body: {}, params: { id_thesis: 1 } };
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        const mockForm = {
          parse: jest.fn((req, callback) => callback(null, {}, { cv: [{}, {}] })),
        };
        jest.spyOn(formidable, 'IncomingForm').mockImplementation(() => mockForm);
      
        await studentController.applyForProposal(mockReq, mockRes);
      
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Multiple files not allowed' });
      });
})
      