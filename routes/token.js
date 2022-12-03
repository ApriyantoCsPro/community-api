"use strict";
const express = require("express")
const router = express.Router()
const { refreshToken } = require("../controllers/RefreshToken")

router.get('/', refreshToken)


module.exports = router

