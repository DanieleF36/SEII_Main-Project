const repository = require('../../repositories/RequestRepository')
const service = require('../../services/RequestService')
const studentRepository = require('../../repositories/StudentRepository')
const teacherRepository = require('../../repositories/TeacherRepository')

describe('thesisRequestHandling', () => {
    let param
    beforeEach( () => {
        param = {
            status: 1,
            id_student: 1,
            request_id: 1,
            teacher_id: 1
        }


        jest.clearAllMocks();
        
    })
    test('Student not found', async () => {
        jest.spyOn(studentRepository, 'getById').mockImplementation(() => false)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(repository, 'getRequest').mockImplementation(() => true)
        try{
            await service.thesisRequestHandling(param.status, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("Student not found")
        }

    })

    test('Teacher not found', async () => {
        jest.spyOn(studentRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => { return {} })
        jest.spyOn(repository, 'getRequest').mockImplementation(() => false)
        try{
            await service.thesisRequestHandling(param.status, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("Teacher not found")
        }

    })
    
    test('Request not found', async () => {
        jest.spyOn(studentRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => {
            return {
                teacher_id: param.teacher_id
            }
        })
        jest.spyOn(repository, 'getRequest').mockImplementation(() => {return {}})
        try{
            await service.thesisRequestHandling(param.status, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("Request not found")
        }

    })


    test('Id student is not matched', async () => {
        jest.spyOn(studentRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => {
            return {
                supervisorId: 1,
                teacher_id: param.teacher_id
            }
        })
        jest.spyOn(repository, 'getRequest').mockImplementation(() => {
            return {
                id_student: 2
            }
        })
        try{
            await service.thesisRequestHandling(param.status, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("Student id in the request db is different from the student id of the request sent")
        }

    })

    test('Teacher id is not matched', async () => {
        jest.spyOn(studentRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => {
            return {
                teacher_id: param.teacher_id
            }
        })
        jest.spyOn(repository, 'getRequest').mockImplementation(() => {
            return {
                supervisorId: 2,
                id_student: 1
            }
        })
        try{
            await service.thesisRequestHandling(param.status, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("Teacher id in the request db is different from the teacher id of the request sent")
        }

    })

    test('Error occurs during email sending step', async () => {
        jest.spyOn(studentRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => {
            return {
                teacher_id: param.teacher_id
            }
        })
        jest.spyOn(repository, 'getRequest').mockImplementation(() => {
            return {
                supervisorId: 1,
                id_student: 1
            }
        })
        jest.spyOn(repository, 'thesisRequestStatusUpdate').mockImplementation(() => {
            return 'error'
        })
        try{
            await service.thesisRequestHandling(param.status, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("studentEmail is not defined")
        }

    })

    test('Error occurs during thesis status update', async () => {

        jest.spyOn(studentRepository, 'getById').mockImplementation(() => true)
        jest.spyOn(teacherRepository, 'getById').mockImplementation(() => {
            return {
                teacher_id: param.teacher_id
            }
        })
        jest.spyOn(repository, 'getRequest').mockImplementation(() => {
            return {
                supervisorId: 1,
                id_student: 1
            }
        })
        jest.spyOn(repository, 'thesisRequestStatusUpdate').mockImplementation(() => {
            return 'error'
        })
        try{
            await service.thesisRequestHandling(0, param.id_student, param.request_id, param.teacher_id)
        }
        catch(error) {
            expect(error.message).toBe("error")
        }

    })
})