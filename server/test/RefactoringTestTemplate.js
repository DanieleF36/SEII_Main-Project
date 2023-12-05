'use strict';

function check(a, b) {
    if (a === b) return { status: 200, message: 'success' };
    else return {
        status: 400, json: { error: "error" }
    }
}

function setupCommon() {
    const mockReq = {
        body: {},
        params: {},
        user: {}
    };
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
}

function isSuccessful(response){
    return response.status === 200 && response.message === 'success';
}
function isFailure(response){
    return response.status === 400 && response.json.error !== undefined;
}

describe('Grosso test', () => {
    beforeEach(() => {
        setupCommon();
    });
    test('Primo test assurdo che ritorna una cosa giusta', () => {
        const response = add(2,2)
        expect(isSuccessful(response).toBe(true));
    });
    test('Secondo test assurdo che ritorna un errore', () => {
        const response = add(2,3)
        expect(isFailure(response).toBe(true));
    })
})