"use strict";
const express = require("express")

const router = express.Router()
const commentController = require("../controllers/comments");
const { verifyToken } = require("../middleware/VerifyToken")


router.post("/", verifyToken, commentController.createComments);
router.get("/", commentController.comments);
router.get("/:comment_id", commentController.findComments);
router.put("/:comment_id", verifyToken, commentController.updateComments);
router.delete("/:comment_id", verifyToken, commentController.deleteComments);

module.exports = router
