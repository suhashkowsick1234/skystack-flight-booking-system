const env = process.env.NODE_ENV || "test";

let config = require("./config/config.json")[env];
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const loginRouter = require("./router/loginRouter");
const seatRouter = require("./router/seatRouter");
const flightRouter = require("./router/flightRouter");

const loggerMiddleware = require("./middleware/loggerMiddleware");

const app = express();
const port = process.env.port || 8081;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect to mongodb database
require("./mongodbModels/connection").connect();

// app.listen(port, () => console.log(`App is listening on port ${port}!`));

const addDefaultHeaders = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, Accept");
    next();
}

app.all("*", addDefaultHeaders);

app.use(loggerMiddleware.logReqRes);

app.use(loginRouter);
app.use('/seat', seatRouter);
app.use('/flight', flightRouter);

app.get('/healthCheck', async (req, res) => {
    res.send("I am healthy")
})

const exceptionHandler = (err, data) => {
    console.log("Goodbye!");
    console.log(err);
    console.log(err.stack);
    console.log(err.message);
    process.exit();
}

const exitHandler = (options, err) => {
    //code is same as exceptionHandler but can be customised as per logging/alerting requirement later
    console.log("Goodbye!");
    console.log(err);
    console.log(err.stack);
    console.log(err.message);
    process.exit();
}

// On app closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

// catching the ctrl + c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

//catching uncaught exceptions
process.on('uncaughtException', exceptionHandler);

// catching unhandled rejections
process.on('unhandledRejection', exceptionHandler);

module.exports = app;