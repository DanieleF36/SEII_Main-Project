jest.mock('sqlite3');
const dbModule = require('../../repositories/db.js');
const sqlite = require('sqlite3').Database;

describe('db', ()=>{
    test('case1: fail', async()=>{
      sqlite.mockImplementation((path, callback) => {
        callback(new Error('Errore di connessione al database'));
      });
      try {
        console.log("Should fail")
      } catch (error) {
        expect(error).toBe({error: "error"});
      }
    })
})