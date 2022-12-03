"use strict";
const express = require("express")

const router = express.Router()
const likeController = require("../controllers/likes");
const { verifyToken } = require("../middleware/VerifyToken")


router.post("/", verifyToken, likeController.createLikes);

module.exports = router
