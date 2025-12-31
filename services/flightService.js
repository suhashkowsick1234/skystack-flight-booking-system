const Flight = require("../mongodbModels/Flight");
const Seat = require("../mongodbModels/Seat");

const scheduleFlight = async(req, res) => {
    try {
        let reqBody = req.body;

        const {airlines, numOfSeats} = reqBody;

        if (!(airlines && numOfSeats)) {
            return res.status(400).send(
                {
                    "success": 0,
                    "errorMessage": "All input is required"
                });
        }

        if(!Number.isInteger(numOfSeats))
            return res.status(400).send({ "success": 0, "errorMessage": "Wrong Input"});

        if( numOfSeats < 1 || numOfSeats > 300 )
            return res.status(400).send({"success": 0, "errorMessage": "Wrong number of seats"})

        //create entry for a flight
        let flightCreated = await Flight.create({
            airlines: airlines,
            numOfSeats: numOfSeats,
            numOfBookedSeats: 0
        })
        
        console.log(flightCreated)

        //generate seat entries
        let seatsArr = [];

        for(let i = 1; i <= numOfSeats; i++) {
            seatsArr.push({
                seatNumber: i,
                passengerId: "0",
                available: true,
                flightId: flightCreated._id,
                passengerName: "DummyUser",
                passengerAge: 0,
                passengerPhone: 0
            })
        }

        const seatsCreated = await Seat.create(seatsArr);

        return res.status(200).send({
            "success": 1,
            "flight": flightCreated,
            "seats": seatsCreated
        })

    } catch (error) {
        console.log(error.stack)
        return res.status(500).send({
            "success": 0,
            "errorMessage": error.message
        })
    }
    
}

// const fetchFlightDetails = async(req, res) => {
//     try {
//         return res.status(200).send({
//             "success": 1
//         })
//     } catch (error) {
//         console.log(error.stack)
//             return res.status(500).send({
//                 "success": 0,
//                 "errorMessage": error.message
//             })
//     }
// }

module.exports = {
    scheduleFlight: scheduleFlight,
}