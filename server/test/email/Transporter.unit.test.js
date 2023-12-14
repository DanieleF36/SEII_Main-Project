const {sendEmail} = require('../../email/transporter');
const t = require('../../email/transporter').transporter;

describe('transporter', ()=>{
    let from, to, subject, text;
    test('case1: from is missing', async()=>{
        try{
            await sendEmail(from, to, subject, text);
        }
        catch(e){
            expect(e).toStrictEqual(new Error("from is missing"));
        }
    });
    test('case2: to is missing', async()=>{
        from='me';
        try{
            await sendEmail(from, to, subject, text);
        }
        catch(e){
            expect(e).toStrictEqual(new Error("to is missing"));
        }
    })
    test('case3: sendEmail fails', async()=>{
        to='you';
        const spy = jest.spyOn(t, 'sendMail').mockImplementation((mailOptions, cb)=>{
            cb(new Error("error"));
        })
        try{
            await sendEmail(from, to, subject, text);
        }
        catch(e){
            expect(e).toStrictEqual(new Error("error"));
        }
        expect(spy).toHaveBeenCalledWith({from, to, subject, text}, expect.any(Function));
    });
    test('case4: success', async()=>{
        to='you';
        const spy = jest.spyOn(t, 'sendMail').mockImplementation((mailOptions, cb)=>{
            cb(null, {success: "success"});
        })
        await expect(sendEmail(from, to, subject, text)).resolves.toEqual({success: "success"});
        
        expect(spy).toHaveBeenCalledWith({from, to, subject, text}, expect.any(Function));
    });    
})