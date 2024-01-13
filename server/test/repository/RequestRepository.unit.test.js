const requestRepository = require('../../repositories/RequestRepository')
const general = require('./generalFuncrtion').repoTest;
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