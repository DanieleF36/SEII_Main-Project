const secretaryRepository = require("../../repositories/SecretaryRepository");

const db = require('../../repositories/db');
const dayjs = require('dayjs')

jest.mock("../../repositories/db");

const general = require('./generalFuncrtion').repoTest;

describe('getById', () => {
    let secretary = {
        id: 1,
        name: "Gianni",
        surname: "Altobelli",
        email: "gianni@gmail.com"
    }

    const errors = ['Email must be provided']
    general(secretaryRepository.getByEmail, 
            ['gianni@gmail.com'], 
            secretary, 
            secretary, 
            errors,
            'get');
})