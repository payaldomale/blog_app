const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createTagController,
    attachTag,
    replaceTags,
    filterPostsByTag,
    getTagsByPostController,
    getAllTagsController
} = require("../controllers/tagController");

const router = express.Router();

// create tag
router.post(
    "/tag/create",
    authMiddleware,
    createTagController
);

// attach single tag
router.post(
    "/tag/attach",
    authMiddleware,
    attachTag
);

// replace all tags
router.put(
    "/tag/replace",
    authMiddleware,
    replaceTags
);

// get all tags
router.get(
    "/tag/all",
    getAllTagsController
);

// get posts by tag
router.get(
    "/tag/:tagId/posts",
    filterPostsByTag
);

// get tags by post
router.get(
    "/post/:postId/tags",
    getTagsByPostController
);

module.exports = router;