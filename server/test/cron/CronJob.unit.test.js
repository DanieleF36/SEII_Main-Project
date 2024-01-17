const cron = require('../../cron/cronJobs');
const dayjs = require('../../dayjsvc/index.dayjsvc')

describe("setExpired", ()=>{
    test("case1:selectExpiredAccordingToDate fails", async()=>{
        const spy = jest.spyOn(require('../../repositories/ThesisRepository'), 'selectExpiredAccordingToDate').mockRejectedValue({ message: "error" });
        try{
            cron.setExpired();
        }catch(e){
            expect(e).toBe({message: "error"})
        }
        expect(spy).toHaveBeenCalledWith(dayjs.vc().format('YYYY-MM-DD').toString())
    });
    test("case2: result not array", async()=>{
        const spy = jest.spyOn(require('../../repositories/ThesisRepository'), 'selectExpiredAccordingToDate').mockResolvedValue("bho");
        const e = cron.setExpired();
        expect(e).toBe(undefined)
        expect(spy).toHaveBeenCalledWith(dayjs.vc().format('YYYY-MM-DD').toString())
    });
    test("case3: setExpiredAccordingToIds fails", async()=>{
        const spy = jest.spyOn(require('../../repositories/ThesisRepository'), 'selectExpiredAccordingToDate').mockResolvedValue(["bho"]);
        const spy1 = jest.spyOn(require('../../repositories/ThesisRepository'), 'setExpiredAccordingToIds').mockRejectedValue({ message: "error" });
        const e = cron.setExpired();
        await new Promise(resolve => setImmediate(resolve));
        expect(e).toBe(undefined)
        expect(spy).toHaveBeenCalledWith(dayjs.vc().format('YYYY-MM-DD').toString())
        expect(spy1).toHaveBeenCalledWith(["bho"])
    });
    test("case4: success", async()=>{
        const spy = jest.spyOn(require('../../repositories/ThesisRepository'), 'selectExpiredAccordingToDate').mockResolvedValue(["bho"]);
        const spy1 = jest.spyOn(require('../../repositories/ThesisRepository'), 'setExpiredAccordingToIds').mockResolvedValue(false);
        const e = cron.setExpired();
        await new Promise(resolve => setImmediate(resolve));
        expect(e).toBe(undefined)
        expect(spy).toHaveBeenCalledWith(dayjs.vc().format('YYYY-MM-DD').toString())
        expect(spy1).toHaveBeenCalledWith(["bho"])
    });
    test("case5: success", async()=>{
        const spy = jest.spyOn(require('../../repositories/ThesisRepository'), 'selectExpiredAccordingToDate').mockResolvedValue(["bho"]);
        const spy1 = jest.spyOn(require('../../repositories/ThesisRepository'), 'setExpiredAccordingToIds').mockResolvedValue(true);
        const e = cron.setExpired();
        await new Promise(resolve => setImmediate(resolve));
        expect(e).toBe(undefined)
        expect(spy).toHaveBeenCalledWith(dayjs.vc().format('YYYY-MM-DD').toString())
        expect(spy1).toHaveBeenCalledWith(["bho"])
    });
})