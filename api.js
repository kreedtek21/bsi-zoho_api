import Db from './dboperations.js';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;
import cors from 'cors';
var app = express();
var router = Router();

app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1', router);

router.use((request, response, next) => {
    next();
});

router.route('/createBid').post((request, response) => {
    Db(request.body.bidName, request.body.firstName, request.body.lastName).then((data) => {
        if (data > 0) {
            response.status(500).json({status: "Failed: Error code " + data});
        } else {
            response.status(201).json({status: "Success"});
        }
    })
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);