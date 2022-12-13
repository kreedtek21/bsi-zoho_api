import config from './dbconfig.js';
import mssql from 'mssql';
const { connect, NVarChar } = mssql;

async function createBid(bidName, firstName, lastName) {
    try {
        let pool = await connect(config);
        let result = await pool.request()
            .input('bidName', NVarChar(75), bidName)
            .input('estimatorFirst', NVarChar(50), firstName)
            .input('estimatorLast', NVarChar(50), lastName)
            .execute('spCreateBid');
        return result.returnValue;
    } catch (err) {
        throw err;
    }
}

export {
    createBid
};