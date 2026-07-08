// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /* ---------------- MODEL POOL (FIXED) ---------------- */
// const MODELS = [
//     "gemini-2.5-flash",
//     "gemini-2.5-pro",
//     "gemini-2.0-flash",
//     "gemini-2.0-flash-001",
//     "gemini-pro-latest",
// ];

// // const MODELS = [
// //     "gemini-2.5-flash",
// //     "gemini-2.0-flash",
// // ];

// /* ---------------- UTIL ---------------- */
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /* ---------------- CORE AI ENGINE ---------------- */
// const generateWithFallback = async (prompt) => {
//     let lastError;

//     for (const modelName of MODELS) {
//         try {
//             console.log(`🧠 Using model: ${modelName}`);

//             const model = genAI.getGenerativeModel({
//                 model: modelName,
//             });

//             const result = await model.generateContent(prompt);
//             return result.response.text();
//         } catch (err) {
//             console.log(`❌ ${modelName} failed`);

//             // Log real reason (IMPORTANT)
//             console.error(err?.message || err);

//             // If quota exceeded → stop immediately (no point retrying same model)
//             if (err?.status === 429) {
//                 lastError = err;
//                 continue;
//             }

//             // Retry only for temporary overload
//             if (err?.status === 503) {
//                 await sleep(1500);

//                 try {
//                     const retryModel = genAI.getGenerativeModel({
//                         model: modelName,
//                     });

//                     const retryResult =
//                         await retryModel.generateContent(prompt);

//                     return retryResult.response.text();
//                 } catch (retryErr) {
//                     lastError = retryErr;
//                     continue;
//                 }
//             }

//             lastError = err;
//         }
//     }

//     throw new Error(
//         lastError?.message ||
//         "All Gemini models failed. Check quota or API key."
//     );
// };

// /* ---------------- SAFE JSON PARSER ---------------- */
// const parseJSON = (text) => {
//     try {
//         const start = text.indexOf("[");
//         const end = text.lastIndexOf("]");

//         if (start === -1 || end === -1) {
//             throw new Error("Invalid JSON format");
//         }

//         return JSON.parse(text.slice(start, end + 1));
//     } catch (err) {
//         console.error("JSON PARSE ERROR:", text);
//         throw new Error("Failed to parse AI response");
//     }
// };

// /* ---------------- AI TITLE ---------------- */
// const generateTitle = async (content) => {
//     const prompt = `
// Generate 5 blog titles.

// Rules:
// - Max 10 words
// - Return ONLY JSON array

// Format:
// ["title1","title2","title3","title4","title5"]

// Content:
// """
// ${content}
// """
// `;

//     const text = await generateWithFallback(prompt);
//     return parseJSON(text);
// };

// /* ---------------- AI SUMMARY ---------------- */
// const generateSummary = async (content) => {
//     const prompt = `
// Summarize this blog.

// Rules:
// - 2–3 sentences
// - simple English
// - no extra text

// Content:
// """
// ${content}
// """
// `;

//     return await generateWithFallback(prompt);
// };

// /* ---------------- AI TAGS ---------------- */
// const generateTags = async (content) => {
//     const prompt = `
// Generate 5 tags.

// Rules:
// - 1–2 words
// - no hashtags
// - return JSON array only

// Format:
// ["tag1","tag2","tag3","tag4","tag5"]

// Content:
// """
// ${content}
// """
// `;

//     const text = await generateWithFallback(prompt);
//     return parseJSON(text);
// };

// /* ---------------- IMPROVE WRITING ---------------- */
// const improveWriting = async (content) => {
//     const prompt = `
// Improve writing.

// Rules:
// - fix grammar
// - improve clarity
// - keep meaning same
// - do not expand

// Content:
// """
// ${content}
// """
// `;

//     return await generateWithFallback(prompt);
// };

// /* ---------------- GRAMMAR FIX ---------------- */
// const fixGrammar = async (content) => {
//     const prompt = `
// Fix grammar only.

// Rules:
// - no rewriting
// - no style change
// - only grammar correction

// Content:
// """
// ${content}
// """
// `;

//     return await generateWithFallback(prompt);
// };

// module.exports = {
//     generateTitle,
//     generateSummary,
//     generateTags,
//     improveWriting,
//     fixGrammar,
// };

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/* ---------------- MODEL ---------------- */

const MODEL = "llama-3.3-70b-versatile";

/* ---------------- AI ENGINE ---------------- */

const generate = async (prompt) => {
    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert AI assistant for professional blogging.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return completion.choices[0].message.content.trim();
    } catch (err) {
        console.error("Groq Error:", err);

        throw new Error(
            err?.error?.message ||
            err?.message ||
            "Groq request failed."
        );
    }
};

/* ---------------- JSON PARSER ---------------- */

const parseJSON = (text) => {
    try {
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");

        if (start === -1 || end === -1) {
            throw new Error("Invalid JSON");
        }

        return JSON.parse(text.slice(start, end + 1));
    } catch (err) {
        console.error("JSON Parse Error:", text);
        throw new Error("Failed to parse AI response");
    }
};

/* ---------------- TITLE ---------------- */

const generateTitle = async (content) => {
    const prompt = `
Generate 5 professional blog titles.

Rules:
- Maximum 10 words each.
- No numbering.
- Return ONLY JSON array.

Example:
[
  "Title One",
  "Title Two",
  "Title Three",
  "Title Four",
  "Title Five"
]

Article:
${content}
`;

    const text = await generate(prompt);

    return parseJSON(text);
};

/* ---------------- SUMMARY ---------------- */

const generateSummary = async (content) => {
    const prompt = `
Summarize this blog.

Rules:
- 2-3 sentences
- Simple English
- No extra text

Content:

${content}
`;

    return await generate(prompt);
};

/* ---------------- TAGS ---------------- */

const generateTags = async (content) => {
    const prompt = `
Generate 5 blog tags.

Rules:
- 1-2 words
- No hashtags
- Return ONLY JSON array

Example:

[
"React",
"Node.js",
"JavaScript",
"Programming",
"Web Development"
]

Content:

${content}
`;

    const text = await generate(prompt);

    return parseJSON(text);
};

/* ---------------- IMPROVE ---------------- */

const improveWriting = async (content) => {
    const prompt = `
Improve this writing.

Rules:
- Fix grammar
- Improve clarity
- Keep original meaning
- Don't make it longer
- Return only improved text

Content:

${content}
`;

    return await generate(prompt);
};

/* ---------------- GRAMMAR ---------------- */

const fixGrammar = async (content) => {
    const prompt = `
Correct only grammar and spelling.

Rules:
- Do NOT rewrite.
- Do NOT improve style.
- Return corrected text only.

Content:

${content}
`;

    return await generate(prompt);
};

module.exports = {
    generateTitle,
    generateSummary,
    generateTags,
    improveWriting,
    fixGrammar,
};
