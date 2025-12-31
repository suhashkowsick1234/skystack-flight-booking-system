const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "test";

let config = require("../config/config.json")[env];

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]; //example -> 'Bearer dwadawdawdsacasfc...'

    if (!token) {
        return res.status(400).send({
            "success": 0,
            "errorMessage": "A token is required for authentication"
        });
    }
    try {
        const decoded = jwt.verify(token, config["authSecret"]);
        userId = decoded.user_id;

        //can fetch User Details using userId in case needed

        //forward the decode user details in the req obj
        req.user = decoded;
    } catch (err) {
        return res.status(400).send({
            "success": 0,
            "errorMessage": "Invalid Token -> " + err.message
        });
    }
    return next();
};

module.exports = {
    verifyToken: verifyToken
};