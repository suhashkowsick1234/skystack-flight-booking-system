const env = process.env.NODE_ENV || "test";
let config = require("../config/config.json")[env];
const os = require("os")
const firehoseUtil = require("../utils/firehoseUtil");

function logReqRes(req, res, next) {
    try{
      var oldWrite = res.write,
        oldEnd = res.end;
      var chunks = [];
  
      if(env === 'production' || env == 'test'){
        res.write = function(chunk) {
          chunks.push(typeof chunk === 'object' ? Buffer.from(JSON.stringify(chunk)) : Buffer.from(chunk));
      
          oldWrite.apply(res, arguments);
        };
      
        res.end = function(chunk) {
          try {
              if (chunk) {
                if(Buffer.isBuffer(chunk))
                  chunks.push(chunk);
                else if(typeof chunk === Object(chunk))
                  chunks.push(Buffer.from(JSON.stringify(chunk)));
                else
                  chunks.push(Buffer.from(chunk))
              }
            var body = Buffer.concat(chunks);
          } catch (ex) {
            console.log(ex, ex.stack);
          }
          var machineName = os.hostname();
        
          var responseData = body.toString();
          var sessionObject = Object.assign({},req.session);
      
          var dataLog = {
            completeUrl : req.protocol + '://' + req.get('host') + req.baseUrl + req.path,
            path: req.baseUrl + req.path,
            host : req.get('host'),
            reqBody: req.body,
            requestHeaders : req.headers,
            reqParams: req.params,
            queryParams: req.query,
            session: sessionObject,
            response: responseData,
            ip: req.ip,
            machine: machineName,
            forwardedIp: req.headers && req.headers["x-forwarded-for"],
            proxyIp: req.connection && req.connection.remoteAddress,
            httpStatusCode : res.statusCode
          };
          
          // console.log(dataLog);
          // firehoseUtil.addLog(dataLog);
      
          oldEnd.apply(res, arguments);
        };
        return next();
      }
    }
    catch(err){
      console.log(err);
    }
    return next();
  }

module.exports = {
    logReqRes: logReqRes
}