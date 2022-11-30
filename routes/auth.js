"use strict";
const express = require("express")

const router = express.Router()
const userController = require("../controllers/users");

router.post("/login", userController.login);
router.post("/register", userController.createUsers);

module.exports = router