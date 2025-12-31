const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../mongodbModels/Users");
const env = process.env.NODE_ENV || "test";

let config = require("../config/config.json")[env];

const register = async (req, res) => {
    try {
        const reqBody = req.body;

        const { name, email, password } = reqBody;
        
        // Validate user input
        if (!(email && password && name)) {
            return res.status(400).send(
                {
                    "success": 0,
                    "errorMessage": "All input is required"
                });
        }
    
        // check if user already exists in our db
        const oldUser = await Users.findOne({ "email": email.toLowerCase() });
    
        if (oldUser) {
            return res.status(500).send({
                "success": 0,
                "errorMessage": "User Already Exists. Please Login"
            });
        }
    
        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await Users.create({
            "name" : name,
            "email": email.toLowerCase(),
            "password": encryptedPassword,
        });
    
        // Generate token
        const token = jwt.sign(
            { user_id: user._id, email },
            config["authSecret"],
            {
                expiresIn: "1h",
            }
        );
    
        // return new user
        res.status(200).send({
            "success": 1,
            "userCreated": user,
            "authToken": token
        });

    } catch (error) {
        console.log(error.stack)
        return res.status(500).send({
            "success": 0,
            "errorMessage": error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send({
                "success": 0,
                "errorMessage": "All input is required"
            });
        }

        // Validate if user exist in our database
        const user = await Users.findOne({ "email": email.toLowerCase() });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate token
            const token = jwt.sign(
                { user_id: user._id, email },
                config["authSecret"],
                {
                    expiresIn: "30m", // valid for 30 minutes
                }
            );

            return res.status(200).send({
                "success": 1,
                "authToken": token
            });
        }

        res.status(500).send({
            "success": 0,
            "errorMessage": "Invalid credentials"
        });
        
    } catch (error) {
        console.log(error.stack)
        return res.status(500).send({
            "success": 0,
            "errorMessage": error.message
        })
    }
}

module.exports = {
    login: login,
    register: register
}