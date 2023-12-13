const request = require("supertest");
const teacherService = require("../../services/TeacherService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe('_sendCancelledEmails', ()=>{
    test('case0: wronged teacherID', async ()=>{
        expect(()=>teacherService._sendCancelledEmails()).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case1: wronged teacherID', async ()=>{
        const mockTeacherID = -1
        expect(()=>teacherService._sendCancelledEmails(mockTeacherID)).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case2: wronged id_thesis', async ()=>{
        const mockTeacherID = 1; 
        expect(()=>teacherService._sendCancelledEmails(mockTeacherID)).rejects.toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case3: wronged id_thesis', async ()=>{
        const mockTeacherID = 1, mockIdThesis = -1;
        expect(()=>teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis)).rejects.toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case4: wronged id_student', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1;
        expect(()=>teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis)).rejects.toThrow(new Error("id_student must exists and be greater than 0"));
    }),
    test('case5: wronged id_student', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = -1;
        expect(()=>teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow(new Error("id_student must exists and be greater than 0"));
    }),
    test('case6: getTeacherEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue("success")

        expect(async()=>await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case7: getThesisTitle fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue("success")
        
        expect(async()=>await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case8: getStudentEmailCancelled fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("success")

        expect(async()=>await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case9: all primeises fail', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockRejectedValue(new Error("error"))

        expect(async()=>await teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case10: transporter.sendEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue(["email1", "email2"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("teacher email")
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockRejectedValue({error: "error"})

        await expect(teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toEqual({error: "error"});
    }),
    test('case11: success', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmailCancelled").mockResolvedValue(["email1", "email2"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("teacher email")
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockResolvedValue()
        //as undefined as the mails number
        await expect(teacherService._sendCancelledEmails(mockTeacherID, mockIdThesis, mockIdStudent)).resolves.toStrictEqual([undefined, undefined]);
    })
})

describe('_sendAcceptedEmail', ()=>{
    test('case0: wronged teacherID', async ()=>{
        expect(()=>teacherService._sendAcceptedEmail()).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case1: wronged teacherID', async ()=>{
        const mockTeacherID = -1
        expect(()=>teacherService._sendAcceptedEmail(mockTeacherID)).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case2: wronged id_thesis', async ()=>{
        const mockTeacherID = 1; 
        expect(()=>teacherService._sendAcceptedEmail(mockTeacherID)).rejects.toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case3: wronged id_thesis', async ()=>{
        const mockTeacherID = 1, mockIdThesis = -1;
        expect(()=>teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis)).rejects.toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case4: wronged id_student', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1;
        expect(()=>teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis)).rejects.toThrow(new Error("id_student must exists and be greater than 0"));
    }),
    test('case5: wronged id_student', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = -1;
        expect(()=>teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow(new Error("id_student must exists and be greater than 0"));
    }),
    test('case6: getTeacherEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue("success")

        expect(async()=>await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case7: getThesisTitle fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue("success")
        
        expect(async()=>await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case8: getStudentEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("success")

        expect(async()=>await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case9: all primeises fail', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockRejectedValue(new Error("error"))

        expect(async()=>await teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case10: transporter.sendEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue(["email1"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("teacher email")
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockRejectedValue({error: "error"})

        await expect(teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toEqual({error: "error"});
    }),
    test('case11: success', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue(["email1"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("teacher email")
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockResolvedValue()
        //as undefined as the mails number
        await expect(teacherService._sendAcceptedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).resolves.toStrictEqual();
    })
})

describe('_sendRejectedEmail', ()=>{
    test('case0: wronged teacherID', async ()=>{
        expect(()=>teacherService._sendRejectedEmail()).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case1: wronged teacherID', async ()=>{
        const mockTeacherID = -1
        expect(()=>teacherService._sendRejectedEmail(mockTeacherID)).rejects.toThrow(new Error("teacherID must exists and be greater than 0"));
    }),
    test('case2: wronged id_thesis', async ()=>{
        const mockTeacherID = 1; 
        expect(()=>teacherService._sendRejectedEmail(mockTeacherID)).rejects.toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case3: wronged id_thesis', async ()=>{
        const mockTeacherID = 1, mockIdThesis = -1;
        expect(()=>teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis)).rejects.toThrow(new Error("id_thesis must exists and be greater than 0"));
    }),
    test('case4: wronged id_student', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1;
        expect(()=>teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis)).rejects.toThrow(new Error("id_student must exists and be greater than 0"));
    }),
    test('case5: wronged id_student', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = -1;
        expect(()=>teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow(new Error("id_student must exists and be greater than 0"));
    }),
    test('case6: getTeacherEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue("success")

        expect(async()=>await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case7: getThesisTitle fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue("success")
        
        expect(async()=>await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case8: getStudentEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("success")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("success")

        expect(async()=>await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case9: all primeises fail', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockRejectedValue(new Error("error"))
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockRejectedValue(new Error("error"))

        expect(async()=>await teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toThrow("error");
    }),
    test('case10: transporter.sendEmail fails', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue(["email1"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("teacher email")
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockRejectedValue({error: "error"})

        await expect(teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).rejects.toEqual({error: "error"});
    }),
    test('case11: success', async ()=>{
        const mockTeacherID = 1, mockIdThesis = 1, mockIdStudent = 1; 
        
        jest.spyOn(require("../../repositories/StudentRepository"), "getStudentEmail").mockResolvedValue(["email1"])
        jest.spyOn(require("../../repositories/ThesisRepository"), "getThesisTitle").mockResolvedValue("title")
        jest.spyOn(require("../../repositories/TeacherRepository"), "getTeacherEmail").mockResolvedValue("teacher email")
        jest.spyOn(require('../../email/transporter'), 'sendEmail').mockResolvedValue()
        //as undefined as the mails number
        await expect(teacherService._sendRejectedEmail(mockTeacherID, mockIdThesis, mockIdStudent)).resolves.toStrictEqual();
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