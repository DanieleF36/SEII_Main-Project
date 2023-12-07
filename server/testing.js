const args = process.argv.slice(2);
const mgmt = require('./mgmt_db.js')
const sqlite = require('sqlite3');
const fs = require('fs');

/**
 * File for switching in use database
 * 
 * command: node testing.js [option]
 * 
 * having option:
 *  -a: show the current state
 *  -c: clean the testing database
 *  -l: load some fake data into the testing database
 *  -i: set integration test state so testing database is going to be used
 *  -u: set unit test state so main database is going to be used
 * 
 * How to perform integration testing:
 *  a script has been defined into package.json with identifier `e2e`
 * 
 * Running `npm run e2e` all the integration tests are going to be perfomed and the state is automatically switched 
 * into the correct one.
 * As well as `npm run unit` will run unit tests setting correctly the whole environment
 */


let db, data;
if (args.length === 0) {
    console.log('Please provide command line arguments.');
} else {
    const flag = args[0];
    require('dotenv').config({path: './variable.env'})

    switch (flag) {
        case '-c':
            db = new sqlite.Database('dbtest.sqlite', (err) => {
                if (err) throw err;
            });

            mgmt.cleanTable()
            console.log("Testing database is clean")
            break;
        case '-l':
            db = new sqlite.Database('dbtest.sqlite', (err) => {
                if (err) throw err;
            });

            mgmt.loadData()
            console.log("Testing database is loaded")
            break;
        case '-s':
            console.log(`Switching state for environment ${process.env.INUSE_DATABASE}`);

            if(process.env.INUSE_DATABASE === "dbtest.sqlite"){
                data = `INUSE_DATABASE="db.sqlite"\nNODE_ENV="nottest"`
                fs.writeFile('variable.env', data, (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    console.log('.env file written successfully');
                  });
            }
            else if(process.env.INUSE_DATABASE === "db.sqlite"){
                data = `INUSE_DATABASE="dbtest.sqlite"\nNODE_ENV="test"`
                fs.writeFile('variable.env', data, (err) => {
                    if (err) {
                    console.error(err);
                    return;
                    }
                    console.log('.env file written successfully');
                });
            }

            console.log("Switched state")
            break;
        case '-a':
            console.log(`Actual state is ${process.env.INUSE_DATABASE}`);
            break;

        default:
            console.log('Unknown flag or no action specified.');
            break;
    }
}
