"use strict";
const express = require("express")

const router = express.Router()
const postController = require("../controllers/posts")
const { verifyToken } = require("../middleware/VerifyToken")


router.post("/", verifyToken, postController.createPosts);
router.get("/", postController.posts);
router.get("/:post_id", postController.findPosts);
router.put("/:post_id", verifyToken, postController.updatePosts);
router.delete("/:user_id", verifyToken, postController.deletePosts);

module.exports = router
