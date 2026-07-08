const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { getPosts } = require("../controllers/postQueryController");

const router = express.Router();

router.get("/post/query", authMiddleware, getPosts);

module.exports = router;
