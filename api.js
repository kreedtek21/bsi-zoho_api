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

const hostname = '0.0.0.0';
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
        // request.originalUrl is complete url path
        var newUrl = `https://${newHost}:${httpsPort}${request.originalUrl}`;
        // 307 redirect keeps method, ie: post
        return response.redirect(307, newUrl);
    } else {
        next();
    }
});

router.use(express.static('./public'));

router.route('/createBid').post((request, response) => {
    var dbName;
    createBid(request.body.bidName, request.body.firstName, request.body.lastName)
        .then((data) => {
            if (data[1].returnValue > 0) {
                response.status(500).json({"error": data[1].returnValue});
            } else {
                response.status(201).json({"bidNo": data[1].output.bidNo, "dbName": data[0]});
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