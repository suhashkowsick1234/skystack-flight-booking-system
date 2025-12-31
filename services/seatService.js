const mongoose = require("mongoose");
const Flight = require("../mongodbModels/Flight");
const Seat = require("../mongodbModels/Seat");

const reserveSeat = async (req, res) => {
    try {
        let reqBody = req.body;
        const {flightId, seatNumber, passengerPhone, passengerName, passengerAge} = reqBody;
        const passengerId =  req.user.user_id;

        //validations
        if(!Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > 300 )
            return res.status(400).send({"success": 0, "errorMessage": "Wrong Seat Number"})

        if(!(flightId && seatNumber && passengerPhone && passengerName && passengerAge))
            return res.status(400).send({"success": 0, "errorMessage": "Missing Parameters"})
        
        if(!Number.isInteger(passengerPhone) || !Number.isInteger(passengerAge))
            return res.status(400).send({"success": 0, "errorMessage": "Wrong Input"})

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const query = {
                flightId: flightId,
                seatNumber: seatNumber,
                available: true
            }
            const slot = await Seat.findOneAndUpdate(query, {
                $set: {
                    passengerId: passengerId,
                    available: false,
                    passengerName: passengerName,
                    passengerAge: passengerAge,
                    passengerPhone: passengerPhone
                }
            }, { useFindAndModify: false, new: true })

            if (!slot) {
                await session.abortTransaction()
                session.endSession()
                return res.status(500).send({
                    "success": 0,
                    "errorMessage": "Seat taken already"
                })
            }

            //increment numOfBookedSeats for that flight
            const flight = await Flight.findOneAndUpdate(
                {_id: flightId}, 
                {$inc : {'numOfBookedSeats' : 1}
            }, { useFindAndModify: false, new: true })

            console.log(flight)

            await session.commitTransaction()

            return res.status(200).send({ 
                "success": 1,
                "message": 'Seat is successfully booked',
                "seat": slot
            })
        } catch (error) {
            await session.abortTransaction()
            console.log(error.stack)
            return res.status(500).send({
                "success": 0,
                "errorMessage": error.message
            })
        } finally {
            session.endSession()
        }

    } catch (error) {
        console.log(error.stack)
        return res.status(500).send({
            "success": 0,
            "errorMessage": error.message
        })
    }
}

const resetSeats = async (req, res) => {
    try {
        let reqBody = req.body;
        const {flightId} = reqBody;
        const userEmail =  req.user.email;

        if(!flightId)
            return res.status(400).send({"success": 0, "errorMessage": "Please pass flightId"}) //should check if flightId is a valid mongodb id or not, #TO-DO

        if(userEmail !== "admin@sukasaair.com")
            return res.status(400).send({"success": 0, "errorMessage": "You Are not authorised to reset seats"})

        const query = {
            flightId: flightId,
        }
        
        //reset all seats of that flightId
        const updatedSeats = await Seat.updateMany(query, {
            $set: {
                passengerId: "0",
                available: false,
                passengerName: "DummyUser",
                passengerAge: 0,
                passengerPhone: 0
            }
        }, {multi: true, new: true })
        
        //reset booked seats count for the flight
        const flight = await Flight.findOneAndUpdate(
            {_id: flightId}, 
            {$set : {'numOfBookedSeats' : 0}
        }, { useFindAndModify: false, new: true })

        console.log(flight)

        return res.status(200).send({ 
            "success": 1,
            "message": 'Reset Successful',
            "updatedSeats": updatedSeats
        })

    } catch (error) {
        console.log(error.stack)
        return res.status(500).send({
            "success": 0,
            "errorMessage": error.message
        })
    }
}

module.exports = {
    reserveSeat: reserveSeat,
    resetSeats: resetSeats
}