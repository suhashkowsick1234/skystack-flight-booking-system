const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const flightService = require("../services/flightService");

const router = express.Router();

//Seat Booking CRUD APIs
router.post('/scheduleFlight', authMiddleware.verifyToken, flightService.scheduleFlight);

// router.get('/fetchFlightDetails', authMiddleware.verifyToken, flightService.fetchFlightDetails);

module.exports = router;