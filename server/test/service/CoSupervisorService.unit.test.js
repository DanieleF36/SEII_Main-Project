const coSupervisorRepository = require('../../repositories/CoSupervisorRepository')
const cosupervisorService = require('../../services/CoSupervisorService')

describe('Get all cosupervisors unit tests', () => {
    test('U1: get all the emails', async () => {
        const expectedRes = [
            'mail1@mail.com',
            'mail2@mail.com',
            'mail3@mail.com'
        ]
        jest.spyOn(coSupervisorRepository, 'getAllEmails').mockImplementation( () => {
            return expectedRes
        })
        const res = await cosupervisorService.getAllCoSupervisorsEmailsService()
        expect(res).toBe(expectedRes)
    })

    test('U2: get all the emails but there are no emails', async () => {
        const expectedRes = []
        jest.spyOn(coSupervisorRepository, 'getAllEmails').mockImplementation( () => {
            return expectedRes
        })
        const res = await cosupervisorService.getAllCoSupervisorsEmailsService()
        expect(res).toBe(expectedRes)
    })

    test('U3: get all the emails but an error occurs', async () => {
        jest.spyOn(coSupervisorRepository, 'getAllEmails').mockImplementation( () => {
            return {error: 'error'}
        })
        const res = await cosupervisorService.getAllCoSupervisorsEmailsService()
        expect(res.error).toBe('error')
    })
})