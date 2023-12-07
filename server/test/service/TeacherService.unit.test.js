const request = require("supertest");
const teacherService = require("../../services/TeacherService");
const applicationRepository = require('../../repositories/ApplicationRepository')

beforeEach(() => {
  jest.clearAllMocks();
});

let mockTeacherID
let mockIdThesis
let mockIdStudent
let mockApplicationId
let mockStatus

beforeEach(() =>{
    mockTeacherID = 1
    mockIdThesis = 1
    mockIdStudent = 1;
    mockApplicationId = 1;
    mockStatus = 1; 
})

describe('_sendCancelledEmails', ()=>{ 
    test('case1: getTeacherEmail fails', async ()=>{
        
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue("success")

        try{
            await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case2: getThesisTitle fails', async ()=>{
        
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue("success")
        
        try{
            await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    
    test('case3: getStudentEmailCancelled fails', async ()=>{
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue("success")

        try{
            await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    
    test('case4: all promises fail', async ()=>{
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error: "error"})

        try{
            await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case5: transporter.sendEmail fails', async ()=>{
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue(["email1", "email2"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email: "teacher email"}])
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockRejectedValue({error: "error"})

        try{
            await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case6: success', async ()=>{
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue(["email1", "email2"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email: "teacher email"}])
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockResolvedValue()
        const res = await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)
        expect(res).toBe(true);
    })
})

describe('_sendAcceptedEmail', ()=>{
    test('case0: teacherRepo.getById fails', async ()=>{
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue("success")
        try{
            await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case1: studentRepo.getId fails', async ()=>{
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue("success")
        try{
            await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case2: thesisRepository.getById fails', async ()=>{        
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockRejectedValue({error : "error"})
        try{
            await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case3: all primeises fail', async ()=>{
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error : "error"})
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockRejectedValue({error : "error"})
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockRejectedValue({error : "error"})
        try{
            await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case4: transporter.sendEmail fails', async ()=>{
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email : "emailteacher1"}])
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email : "emailstudent1"}])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue({title : "title"})
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockRejectedValue({error: "error"})
        try{
            await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case5: success', async ()=>{
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email : "emailteacher1"}])
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email : "emailstudent1"}])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue({title : "title"})
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockResolvedValue()
        const res = await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        expect(res).toBe(true);
    })
})

describe('_sendRejectedEmail', ()=>{
    test('case1: getTeacherEmail fails', async ()=>{
        
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue([{email: "teacher email"}])
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email: "student email"}])

        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    });
    test('case2: getThesisTitle fails', async ()=>{
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email: "teacher email"}])
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email: 'student mail'}])
        
        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })

    test('case3: wronged id_thesis', async ()=>{
        mockIdThesis = -1;
        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })

    test('case4: wronged id', async ()=>{
        mockIdStudent = -1;
        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case5: wronged id_student', async ()=>{
        mockIdStudent = -1;
        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case6: getTeacherMail fails', async ()=>{
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue({title: 'title'})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email: 'student mail'}])
        
        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case7: getStudentMail fails', async ()=>{
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue({title: 'title'})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue({email: 'student mail'})
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockRejectedValue({error: "error"})
        
        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case8: all primeises fail', async ()=>{
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockRejectedValue({error: "error"})
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockRejectedValue({error: "error"})

        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case9: transporter.sendEmail fails', async ()=>{
        
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue({title: "title"})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email: "teacher email"}])
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email: 'student mail'}])
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockRejectedValue({error: "error"})

        try{
            await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"})
        }
    })
    test('case10: success', async ()=>{
        
        jest.spyOn(require("../../repositories/ThesisRepository"), "getById").mockResolvedValue({title: "title"})
        jest.spyOn(require("../../repositories/TeacherRepository"), "getById").mockResolvedValue([{email: "teacher email"}])
        jest.spyOn(require("../../repositories/StudentRepository"), "getById").mockResolvedValue([{email: 'student mail'}])
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockResolvedValue(true)

        const res = await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)
        expect(res).toBe(true);
    })
})

describe('acceptApplication Service',()=>{
    test('case0: Application is missing', async()=>{
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getById").mockResolvedValue(undefined)
        try{
            await teacherService.acceptApplication(mockStatus, mockTeacherID, mockApplicationId);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "No application was found, application is missing or is of another teacher"})
        }
    })
    test('case1: Wrong application owner', async()=>{
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getById").mockResolvedValue({id_thesis : 1, id_student :1, id_teacher : 10})
        try{
            await teacherService.acceptApplication(mockStatus, mockTeacherID, mockApplicationId);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "This application does not own to that teacher, he cant accept it"})
        }
    })
    test('case2: applicationRepository.updateStatus fail', async()=>{
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getById").mockResolvedValue({id_thesis : 1, id_student :1, id_teacher : 1})
        jest.spyOn(require("../../repositories/ApplicationRepository"), "updateStatus").mockRejectedValue({error : "error"})
        try{
            await teacherService.acceptApplication(mockStatus, mockTeacherID, mockApplicationId);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"});
        }
    })
    test('case3: applicationRepository.updateStatusToCancelledForOtherStudent fail', async()=>{
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getById").mockResolvedValue({id_thesis : 1, id_student :1, id_teacher : 1})
        jest.spyOn(require("../../repositories/ApplicationRepository"), "updateStatus").mockResolvedValue(true);
        jest.spyOn(require("../../repositories/ApplicationRepository"), "updateStatusToCancelledForOtherStudent").mockRejectedValue({error : "error"})
        try{
            await teacherService.acceptApplication(mockStatus, mockTeacherID, mockApplicationId);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"});
        }
    })
    test('case4: thesisRepository.setStatus fail', async()=>{
        jest.spyOn(require("../../repositories/ApplicationRepository"), "getById").mockResolvedValue({id_thesis : 1, id_student :1, id_teacher : 1})
        jest.spyOn(require("../../repositories/ApplicationRepository"), "updateStatus").mockResolvedValue(true);
        jest.spyOn(require("../../repositories/ApplicationRepository"), "updateStatusToCancelledForOtherStudent").mockResolvedValue(true);
        jest.spyOn(require("../../repositories/ThesisRepository"), "setStatus").mockRejectedValue({error : "error"})
        try{
            await teacherService.acceptApplication(mockStatus, mockTeacherID, mockApplicationId);
        }
        catch(error) {
            expect(error).toStrictEqual({error: "error"});
        }
    })
})

describe('browseApplicationProfessor unit tests', () => {
    const applications = [
        {
            id_student: 1,
            id_application: 1,
            id_thesis: 1,
            title: 'title',
            name: 'name',
            surname: 'surname',
            data: '2024-10-10',
            path: '/path/to/the/file',
            status: 1
        }
    ]
    const id_professor = 1
    test('U1: get all the applications by id', async () => {
        jest.spyOn(applicationRepository, 'getByTeacherId').mockImplementation(() => {
            return applications
        })
        const res = await teacherService.browseApplicationProfessor(id_professor)
        expect(res).toBe(applications)
    })
    test('U2: get all the applications but there are none', async () => {
        jest.spyOn(applicationRepository, 'getByTeacherId').mockImplementation(() => {
            return []
        })
        const res = await teacherService.browseApplicationProfessor(id_professor)
        expect(res.length).toBe(0)
    })
    test('U3: get all the applications but an error occurs', async () => {
        jest.spyOn(applicationRepository, 'getByTeacherId').mockImplementation(() => {
            return {error: 'error'}
        })
        const res = await teacherService.browseApplicationProfessor(id_professor)
        expect(res.error).toBe('error')
    })
})
