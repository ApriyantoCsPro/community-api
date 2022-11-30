"use strict";
const express = require("express")

const router = express.Router()
const userController = require("../controllers/users");
const {verifyToken} = require("../middleware/VerifyToken")


router.get("/", verifyToken, userController.users);
router.get("/:user_id", userController.findUsers);
router.put("/:user_id", userController.updateUsers);
router.delete("/:user_id", userController.deleteUsers);

module.exports = router