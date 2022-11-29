"use strict";
const express = require("express")

const router = express.Router()
const reactionController = require("../controllers/reactions");

router.post("/", reactionController.createReactions);

module.exports = router