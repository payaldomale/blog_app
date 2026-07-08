require("dotenv").config();

async function listModels() {
    try {
        const res = await fetch(
            // `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GROQ_API_KEY}`
        );

        const data = await res.json();

        console.log("FULL RESPONSE:");
        console.log(JSON.stringify(data, null, 2));

        if (!data.models) {
            console.log("❌ No models found. Possible API key issue.");
            return;
        }

        console.log("\nAVAILABLE MODELS:\n");

        data.models.forEach((m) => {
            console.log(m.name);
        });

    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

listModels();