const express = require("express");
const loginService = require("../services/loginService");

const router = express.Router();

//Login APIs

router.post('/register', loginService.register);
router.post('/login', loginService.login);

module.exports = router;