const config = {
    user: 'zohoapi', // sql user
    password: '25AdLMdo09ZV', //sql user password
    server: '10.1.228.171', // if it does not work try- localhost
    database: '2022-ost-master',
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instancename:  'MSSQLSERVER'  // SQL Server instance name
    },
    port: 1433
}

export default config;