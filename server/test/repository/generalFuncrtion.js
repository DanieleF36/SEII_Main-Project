const db = require('../../repositories/db.js');
jest.mock("../../repositories/db");

/**
 * 
 * @param {*} fun pointer to the method to test
 * @param {*} rigthValue array that cointains all the right input, for example [1, 2 ""] for the fun update(id, id_Student, cv)
 * @param {*} valueReturnedByDb  value for the returned value of db function. Can be undefined
 * @param {*} returnResolvedOutput value for the returned value of the function. Can be undefined
 * @param {*} returnValueInputError array with the string of the error throw in error
 * @param {*} dbFunction string for the db function used, 'all', 'run'
 * @param {*} isUpdate if the function is an update will be tested the case of error for no changes in db and expect that the resolved value is this.changes
 * @param {*} errForNoRow 
 */
exports.repoTest = (fun,rigthValue, valueReturnedByDb, returnResolvedOutput, returnValueInputError, dbFunction, isUpdate, errForNoRow)=>{
    for(let j=0;j<rigthValue.length;j++){
        test("case1."+j+": input error", async()=>{
            try{
                const array = rigthValue.slice(0, j);
                await fun(...array)
            }catch(e){
                expect(e.message).toStrictEqual(returnValueInputError[j])
            }
        });
    }

    test('case2: reject', async()=>{
        jest.spyOn(require('../../repositories/db.js'), dbFunction).mockImplementation((sql, param, callback)=>{
            callback(new Error("some"));
        })
        try{
            await fun(...rigthValue)
        }catch(e){
            expect(e.message).toStrictEqual("some")
        }
    });
    if(isUpdate)
        test('case 4: no row update', async()=>{
            db[dbFunction].mockImplementationOnce((sql, param, callback)=>{
                callback.call({changes:0, lastID:0},null);
            });
            try{
                await fun(...rigthValue);
            }catch(e){
                expect(e.message).toEqual(errForNoRow)
            }
        })
    test('case3: resolved', async()=>{
        db[dbFunction].mockImplementationOnce((sql, param, callback)=>{
            if(dbFunction != "run")
                callback(null, valueReturnedByDb?valueReturnedByDb:{success: "success"});
            else{
                callback.call({changes:1, lastID:1},null);
            }
        });
        const res = await fun(...rigthValue);
        await new Promise(resolve => setImmediate(resolve));
        if(!isUpdate)
            expect(res).toStrictEqual(returnResolvedOutput?returnResolvedOutput:{success: "success"})
        else
            expect(res).toStrictEqual(1)
    })
}