const requestRepository = require('../../repositories/RequestRepository')
const general = require('./generalFuncrtion').repoTest;

jest.mock("../../repositories/db");
beforeEach(() => {
    jest.clearAllMocks();
  });
describe('thesisRequestStatusUpdate', () => {
    const errors = [
        "Parameters are wrong",
        "Parameters are wrong",
        "Parameters are wrong"
    ]
    general(requestRepository.thesisRequestStatusUpdate,
            [ 1, 1 ],
            [undefined],
            1,
            errors,
            'run');

})


describe('getRequestAll', () => {
  const requests = [
    {
      success: "success"
    }
  ]

  general(requestRepository.getRequestAll,
          [],
          ...requests,
          undefined,
          undefined,
          'all');

})

describe('getRequestsByProfessor', () => {
  const requests = [
    {
      success: "success"
    }
  ]

  const errors = [
    "Parameter is wrong"
  ]
  
  general(requestRepository.getRequestsByProfessor,
          [1],
          ...requests,
          undefined,
          errors,
          'all');

})
describe('getRequest', () => {
  const errors = [
    "Request id must be provided"
  ]
  
  const result = {
    description: undefined,
    statusS: undefined,
    statusT: undefined,
    studentId: undefined,
    supervisorId: undefined,
  }
  general(requestRepository.getRequest,
          [1],
          [result],
          result,
          errors,
          'get');

})

describe('getActiveByStudentId', () => {
  const errors = [
    "Student ID must be greater than or equal to 0"
  ]

  const result = {
    id: 1,
    studentId: 1,
    supervisorId: 1,
    description: 'text',
    statusS: 1,
    statusT: 0
  }
  general(requestRepository.getActiveByStudentId,
          [1],
          result,
          result,
          errors,
          'get');
})

describe('getRequestByStudentId', () => {
  const errors = [
    "Student ID not valid"
  ]

  const result = {
    id: 1,
    studentId: 1,
    supervisorId: 1,
    description: 'text',
    statusS: 1,
    statusT: 0
  }
  general(requestRepository.getRequestByStudentId,
          [1],
          result,
          result,
          errors,
          'get');
})
describe('profReqStatusUpdate', () => {
    const errors = [
      "Request and status must be defined",
      "Request and status must be defined"
    ]
    general(requestRepository.profReqStatusUpdate,
            [ 1, 1 ],
            [undefined],
            1,
            errors,
            'run');

})
