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