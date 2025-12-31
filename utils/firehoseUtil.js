const AWS = require("aws-sdk");
const env = process.env.NODE_ENV || "test";

var config = require('../config/config.json')[env]

AWS.config.update({
    accessKeyId: config["aws"]["accessKey"],
    secretAccessKey: config["aws"]["secretKey"],
    region: 'ap-south-1'
});

const firehose = new AWS.Firehose();

const addLog = async(data) => {
    //Kinesis stream set up to send data to ES from which kibana can read. S3 intermediate in order to push to any data lake or backup purpose
    const params = {
        DeliveryStreamName: config.logStreams.appLogStream,
        Record: {
            Data: JSON.stringify(data) + '\n',
        }
    };
    try {
        firehose.putRecord(params, function(err,data) {
            if(err) {
                console.log(err.stack)
                return {success: 0, error: err.stack}
            }
        });
        return {success: 1, "message": "successful"};
    } catch(error) {
        console.log(`error sending event to firehose: ${error.stack}`);
        return {success: 0, error: error.stack}
    }
}

module.exports = {
    addLog: addLog
}