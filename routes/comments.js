"use strict";
const express = require("express")

const router = express.Router()
const commentController = require("../controllers/comments");

router.post("/", commentController.createComments);
router.get("/", commentController.comments);
router.get("/:comment_id", commentController.findComments);
router.put("/:comment_id", commentController.updateComments);
router.delete("/:comment_id", commentController.deleteComments);

module.exports = router
