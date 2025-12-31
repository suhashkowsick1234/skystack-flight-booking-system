const Redis = require("ioredis");
const env = process.env.NODE_ENV || "test";
const config = require('/../config/config.json')[env];

let redisOptions = {}

if(env !== "production"){
    redisOptions = { showFriendlyErrorStack: true };
}

const redis = new Redis({
    port: config["redis"]["port"],
    host: config["redis"]["host"],
    // maxRetriesPerRequest: 0,
}, redisOptions);
const RedisTimeout = require('ioredis-timeout');
RedisTimeout(redis, 5000);
RedisTimeout.timeout('set', 5000, redis);
RedisTimeout.timeout('get', 5000, redis);

const redisUtils = {};

redisUtils.setKeyWithExpiry = async(key, value, expiry) => {
    try {
        const expiryInSecs = expiry * 60 * 60;
        await redis.set(key, value, 'ex', expiryInSecs);
    } catch(err) {
        console.log(err.stack)
        return null;
    }
}


redisUtils.getKey = async(key) => {
    try {
        const result = await redis.get(key);
        return result;
    } catch(err) {
        console.log(err.stack)
        return null;
    }
}

module.exports = redisUtils;