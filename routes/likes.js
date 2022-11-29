"use strict";
const express = require("express")

const router = express.Router()
const likeController = require("../controllers/likes");

router.post("/", likeController.createLikes);

module.exports = router
