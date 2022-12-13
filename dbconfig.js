import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    server: process.env.SQL_HOST,
    database: '2022-ost-master',
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename:  'MSSQLSERVER'  // SQL Server instance name
    },
    port: parseInt(process.env.SQL_PORT)
}

export default config;