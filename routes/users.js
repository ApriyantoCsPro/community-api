"use strict";
const express = require("express")

const router = express.Router()
const userController = require("../controllers/users");


router.get("/", userController.users);
router.get("/:user_id", userController.findUsers);
router.put("/:user_id", userController.updateUsers);
router.delete("/:user_id", userController.deleteUsers);

module.exports = router