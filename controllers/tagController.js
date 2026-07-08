const {
    createTag,
    getTagByName,
    attachTagToPost,
    removeTagsFromPost,
    getPostsByTag,
    getTagsByPost,
    getAllTags
} = require("../models/tagModel");

const { getPostById } = require("../models/postModel");

// Create tag
// const createTagController = async (req, res) => {
//     try {
//         const { name } = req.body;

//         const existing = await getTagByName(name);

//         if (existing) {
//             return res.status(400).json({
//                 message: "Tag already exists"
//             });
//         }

//         const tag = await createTag(name);

//         return res.status(201).json({
//             message: "Tag created",
//             data: tag
//         });

//     } catch (err) {
//         return res.status(500).json({
//             message: err.message
//         });
//     }
// };

const createTagController = async (req, res) => {
    try {
        const { name } = req.body;

        // 1. validate input
        if (!name || typeof name !== "string") {
            return res.status(400).json({
                message: "Tag name is required"
            });
        }

        const cleanName = name.trim().toLowerCase();

        if (cleanName.length < 2) {
            return res.status(400).json({
                message: "Tag too short"
            });
        }

        // 2. create tag safely
        const tag = await createTag(cleanName);

        if (!tag) {
            return res.status(200).json({
                message: "Tag already exists or not created",
            });
        }

        return res.status(201).json({
            message: "Tag created",
            data: tag
        });

    } catch (err) {
        console.error("TAG CREATE ERROR:", err); // IMPORTANT
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Attach a single tag to a post
const attachTag = async (req, res) => {
    try {
        const { post_id, tag_id } = req.body;

        const post = await getPostById(post_id);

        if (!post || post.is_deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Allow both draft and published posts
        const result = await attachTagToPost(post_id, tag_id);

        return res.status(201).json({
            message: "Tag attached",
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// Replace all tags of a post
const replaceTags = async (req, res) => {
    try {
        const { post_id, tag_ids } = req.body;

        const post = await getPostById(post_id);

        if (!post || post.is_deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Remove existing tags
        await removeTagsFromPost(post_id);

        // Attach new tags
        for (const tagId of tag_ids) {
            await attachTagToPost(post_id, tagId);
        }

        return res.status(200).json({
            message: "Tags updated successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// Get posts by tag
const filterPostsByTag = async (req, res) => {
    try {
        const { tagId } = req.params;

        const posts = await getPostsByTag(tagId);

        return res.status(200).json({
            message: "Posts fetched",
            data: posts
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// Get tags of a post
const getTagsByPostController = async (req, res) => {
    try {
        const { postId } = req.params;

        const tags = await getTagsByPost(postId);

        return res.status(200).json({
            data: tags
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

// Get all tags
const getAllTagsController = async (req, res) => {
    try {
        const tags = await getAllTags();

        return res.status(200).json({
            data: tags
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    createTagController,
    attachTag,
    replaceTags,
    filterPostsByTag,
    getTagsByPostController,
    getAllTagsController
};