const { generateTitle, generateSummary, generateTags, improveWriting, fixGrammar } = require("../services/geminiService");

/* ---------------- AI TITLE ---------------- */
const createTitle = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }

        const titles = await generateTitle(content);

        return res.status(200).json({
            success: true,
            titles,
        });

    } catch (err) {
        console.log("AI ERROR:", err.message);

        return res.status(500).json({
            success: false,
            message: "AI generation failed",
            error: err.message,
        });
    }
};


/* ---------------- AI SUMMARY ---------------- */
const createSummary = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const summary = await generateSummary(content);

        return res.json({
            success: true,
            summary
        });

    } catch (err) {
        console.log("AI SUMMARY ERROR:", err.message);

        return res.status(500).json({
            message: "AI summary generation failed",
            error: err.message
        });
    }
};

/* ---------------- AI TAGS ---------------- */
const createTags = async (req, res) => {
    try {
        const { content } = req.body;

        const tags = await generateTags(content);

        return res.json({
            success: true,
            tags
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "AI tags failed",
            error: err.message
        });
    }
};


/* ---------------- AI IMPROVE ---------------- */
const createImprovedWriting = async (req, res) => {
    try {
        const { content } = req.body;

        const result = await improveWriting(content);

        return res.json({
            success: true,
            content: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "AI improve writing failed",
            error: err.message
        });
    }
};


/* ---------------- AI GRAMMAR ---------------- */
const createGrammarFix = async (req, res) => {
    try {
        const { content } = req.body;

        const result = await fixGrammar(content);

        return res.json({
            success: true,
            content: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "AI grammar fix failed",
            error: err.message
        });
    }
};

module.exports = { createTitle, createSummary, createTags, createImprovedWriting, createGrammarFix };
