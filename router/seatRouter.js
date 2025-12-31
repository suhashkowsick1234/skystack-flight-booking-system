const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const seatService = require("../services/seatService");

const router = express.Router();

//Seat Booking CRUD APIs
router.post('/reserve', authMiddleware.verifyToken, seatService.reserveSeat);

router.post('/reset', authMiddleware.verifyToken, seatService.resetSeats);

module.exports = router;