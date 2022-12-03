"use strict";
const express = require("express")

const router = express.Router()
const followController = require("../controllers/follow");
const { verifyToken } = require("../middleware/VerifyToken")

router.post("/", verifyToken, followController.createFollow);

module.exports = router
 