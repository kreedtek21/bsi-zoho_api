import {createBid} from './dboperations.js';
import http from 'http';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
const { urlencoded, json } = bodyParser;
import cors from 'cors';
var app = express();
var router = Router();

const hostname = 'home.demosys.us';
const httpPort = 8080;
const httpsPort = 8443;

const httpsOptions = {
    cert: fs.readFileSync('./ssl/cert.pem'),
    key: fs.readFileSync('./ssl/key.pem')
};

app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', router);

router.use((request, response, next) => {
    var newHost = request.headers.host.substring(0, request.headers.host.indexOf(':'));
    if (request.protocol === 'http') {
        console.log('need to redirect');
        response.redirect(301, `https://${newHost}:${httpsPort}${request.url}`);
        console.log('after redirect');
    }
    next();
});

router.use(express.static('./public'));

router.use((request, response, next) => {
    next();
});

router.route('/createBid').post((request, response) => {
    console.log(request.protocol);
    createBid(request.body.bidName, request.body.firstName, request.body.lastName)
        .then((data) => {
            if (data > 0) {
                response.status(500).json({error: "Failed: Error code " + data});
            } else {
                response.status(201).json({success: "Success"});
            }
        })
        .catch((e) => {
            console.error(e);
            response.status(500).json({error: e});
        });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);
httpServer.listen(httpPort, hostname);
httpsServer.listen(httpsPort, hostname);

console.log('Zoho API is runnning at ' + httpsPort + ' on ' + hostname);