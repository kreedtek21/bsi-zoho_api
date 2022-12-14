import config from './dbconfig.js';
import mssql from 'mssql';
const { connect, NVarChar, Int } = mssql;

const pools = new Map();

async function createBid(bidName, firstName, lastName) {
    try {
        var dbName = (new Date().getFullYear()) + "-ost-" + firstName.toLowerCase() + "_" + lastName.toLowerCase();
        config.database = dbName;

        if (!pools.get(dbName)) {
            var newPool = new mssql.ConnectionPool(config);
            pools.set(dbName, newPool);
        }

        console.info("Using database " + dbName);
        let pool = await pools.get(dbName).connect();
        let result = await pool.request()
            .input('bidName', NVarChar(75), bidName)
            .input('estimatorFirst', NVarChar(50), firstName)
            .input('estimatorLast', NVarChar(50), lastName)
            .output('bidNo', Int)
            .execute('spCreateBid')
            return [dbName, result];
    } catch (err) {
        throw err;
    }
}

export {
    createBid
};