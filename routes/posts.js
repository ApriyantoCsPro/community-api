"use strict";
const express = require("express")

const router = express.Router()
const postController = require("../controllers/posts")

router.post("/", postController.createPosts);
router.get("/", postController.posts);
router.get("/:post_id", postController.findPosts);
router.put("/:post_id", postController.updatePosts);
router.delete("/:user_id", postController.deletePosts);

module.exports = router
