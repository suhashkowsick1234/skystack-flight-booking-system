const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "test";

let config = require("../config/config.json")[env];

const fetchDummyToken = () => {
    const email = "dummyemail@gmail.com";
    const token = jwt.sign(
        { user_id: "123", email },
        config["authSecret"],
        {
            expiresIn: "30m", // valid for 30 minutes
        }
    );
    return token
}

const fetchAdminToken = () => {
    const email = "admin@sukasaair.com";
    const token = jwt.sign(
        { user_id: "123", email },
        config["authSecret"],
        {
            expiresIn: "30m", // valid for 30 minutes
        }
    );
    return token
}


module.exports = {
    fetchDummyToken: fetchDummyToken,
    fetchAdminToken: fetchAdminToken
}