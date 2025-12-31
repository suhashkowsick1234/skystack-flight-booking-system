const mongoose = require('mongoose')
const { Schema } = mongoose

const seatSchema = new Schema({
    seatNumber: { 
        type: Number, 
        required: true 
    },
    passengerId: { 
        type: String, 
        required: true 
    },
    available: { 
        type: Boolean, 
        required: true,
        default: false
    },
    flightId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
    passengerPhone : {
        type: Number,
        required: true,
        default: 0
    },
    passengerName: {
        type: String,
        required: true,
        default: ""
    }, 
    passengerAge: {
        type: Number,
        required: true,
        default: 0
    },
}, {timestamps: true})

module.exports = mongoose.model('Seat', seatSchema)