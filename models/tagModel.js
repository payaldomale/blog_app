const db = require("../config/db");

// create tag
// const createTag = async (name) => {
//     const existing = await getTagByName(name);
//     if (existing) return existing;

//     const query = `
//         INSERT INTO tag (name)
//         VALUES ($1)
//         RETURNING *;
//     `;

//     const result = await db.query(query, [name]);
//     return result.rows[0];
// };

const createTag = async (name) => {
    const query = `
        INSERT INTO tag(name)
        VALUES($1)
        ON CONFLICT (name)
        DO NOTHING
        RETURNING *;
    `;

    const result = await db.query(query, [name]);

    return result.rows[0] || null;
};

// get tag by name
const getTagByName = async (name) => {
    const query = `
        SELECT *
        FROM tag
        WHERE name = $1;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0];
};

// attach tag to post
const attachTagToPost = async (post_id, tag_id) => {
    const query = `
        INSERT INTO posttag (post_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *;
    `;

    const result = await db.query(query, [post_id, tag_id]);
    return result.rows[0];
};

// remove all tags from a post
const removeTagsFromPost = async (post_id) => {
    const query = `
        DELETE FROM posttag
        WHERE post_id = $1;
    `;

    await db.query(query, [post_id]);
};

// get posts by tag
const getPostsByTag = async (tag_id) => {
    const query = `
        SELECT p.*
        FROM posts p
        JOIN posttag pt ON p.id = pt.post_id
        WHERE pt.tag_id = $1
        AND p.status = 'published'
        AND p.is_deleted = FALSE
        ORDER BY p.published_at DESC;
    `;

    const result = await db.query(query, [tag_id]);
    return result.rows;
};

// get tags by post
const getTagsByPost = async (post_id) => {
    const query = `
        SELECT t.*
        FROM tag t
        JOIN posttag pt ON t.id = pt.tag_id
        WHERE pt.post_id = $1;
    `;

    const result = await db.query(query, [post_id]);
    return result.rows;
};

// get all tags
const getAllTags = async () => {
    const query = `
        SELECT *
        FROM tag
        ORDER BY name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

module.exports = {
    createTag,
    getTagByName,
    attachTagToPost,
    removeTagsFromPost,
    getPostsByTag,
    getTagsByPost,
    getAllTags
};