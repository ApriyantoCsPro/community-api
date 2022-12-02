"use strict";
const express = require("express")

const router = express.Router()
const reactionController = require("../controllers/reactions");
const { verifyToken } = require("../middleware/VerifyToken")

router.post("/", verifyToken, reactionController.createReactions);

module.exports = router