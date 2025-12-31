const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: null 
    },
    email: { 
      type: String, 
      unique: true 
    },
    password: { 
      type: String 
    },
}, { timestamps: true });

const Users = mongoose.model("user", userSchema);

module.exports = Users