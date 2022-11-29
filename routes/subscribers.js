"use strict";
const express = require("express")

const router = express.Router()
const subscribeController = require("../controllers/subscribers");

router.post("/", subscribeController.createSubscribes);

module.exports = router
