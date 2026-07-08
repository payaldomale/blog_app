const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { createTitle, createSummary, createTags, createImprovedWriting, createGrammarFix } = require("../controllers/aiController");

router.post("/ai/generate-title", authMiddleware, createTitle);
router.post("/ai/generate-summary", authMiddleware, createSummary);
router.post("/ai/generate-tags", authMiddleware, createTags);
router.post("/ai/improve-writing", authMiddleware, createImprovedWriting);
router.post("/ai/fix-grammar", authMiddleware, createGrammarFix);

module.exports = router;
