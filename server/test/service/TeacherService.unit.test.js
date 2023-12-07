const request = require("supertest");
const teacherService = require("../../services/TeacherService");

beforeEach(() => {
  jest.clearAllMocks();
});

let mockTeacherID
let mockIdThesis
let mockIdStudent
let mockApplicationId

beforeEach(() =>{
    mockTeacherID = 1
    mockIdThesis = 1
    mockIdStudent = 1;
    mockApplicationId = 1; 
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

describe('acceptApplication',()=>{
    test('case0: wrongedTeacherId=undefined', async()=>{
        const mockTeacherId = undefined, mockStatus = 1, mockApplicationId = 1;
        expect(teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case1: wrongedTeacherId<0', async()=>{
        const mockTeacherId = -1, mockStatus = 1, mockApplicationId = 1;
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case2: wrongedApplication=undefined', async()=>{
        const mockTeacherId = 1, mockStatus = 1, mockApplicationId = undefined;
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("applicationID must exists and be greater than 0"));
    }),
    test('case3: wrongedApplication<0', async()=>{
        const mockTeacherId = 1, mockStatus = 1, mockApplicationId = -1;
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("applicationID must exists and be greater than 0"));
    }),
    test('case4: status undefined', async()=>{
        const mockTeacherId = 1, mockStatus = undefined, mockApplicationId = 1;
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("status must exists and be one or two or three"));
    }),
    test('case5: status < 0', async()=>{
        const mockTeacherId = 1, mockStatus = -1, mockApplicationId = 1;
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("status must exists and be one or two or three"));
    }),
    test('case6: status > 3', async()=>{
        const mockTeacherId = 1, mockStatus = 4, mockApplicationId = 1;
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow(new Error("status must exists and be one or two or three"));
    }),
    test('case7: row==0', async()=>{
        const mockTeacherId = 1, mockStatus = 3, mockApplicationId = 1;
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'getApplication').mockResolvedValue(0);
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow( new Error("No application was found, application is missing or is of another teacher"));
    }),
    test('case8: row.id_teacher != teacherID', async()=>{
        const mockTeacherId = 1, mockStatus = 3, mockApplicationId = 1;
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'getApplication').mockResolvedValue({id_teacher:2});
        expect(()=>teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId)).rejects.toThrow( new Error("This application does not own to that teacher, he cant accept it"));
    }),
    test('case9: success, status==1', async()=>{
        const mockTeacherId = 1, mockStatus = 1, mockApplicationId = 1;
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'getApplication').mockResolvedValue({id:1, id_student:1, id_thesis:1, id_teacher:1, data:"2023-05-23", path_cv:"path", status:0});
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'updateStatus').mockResolvedValue();
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'updateStatusToCancelledForOtherStudent').mockResolvedValue();
        jest.spyOn(require('../../repositories/ThesisRepository'), 'setStatus').mockResolvedValue();
        jest.spyOn(require('../../services/TeacherService'), '_sendCancelledEmails').mockResolvedValue();
        jest.spyOn(require('../../services/TeacherService'), '_sendAcceptedEmail').mockResolvedValue();
        
        const mockRes = await teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId);
        expect(mockRes).toEqual(mockStatus)
    }),
    test('case10: success, status1=1', async()=>{
        const mockTeacherId = 1, mockStatus = 2, mockApplicationId = 1;
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'getApplication').mockResolvedValue({id:1, id_student:1, id_thesis:1, id_teacher:1, data:"2023-05-23", path_cv:"path", status:0});
        jest.spyOn(require('../../repositories/ApplicationRepository'), 'updateStatus').mockResolvedValue();
        jest.spyOn(require('../../services/TeacherService'), '_sendRejectedEmail').mockResolvedValue();
        const mockRes = await teacherService.acceptApplication(mockStatus, mockTeacherId, mockApplicationId);
        expect(mockRes).toEqual(mockStatus)
    })
})