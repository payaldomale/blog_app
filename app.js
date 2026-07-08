require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const likesRoutes = require("./routes/likeRoutes");
const tagRoutes = require("./routes/tagRoutes");
const postQueryRoutes = require("./routes/postQueryRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use(express.json());
// app.use(cors());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://blog-app-frontend-two-chi.vercel.app"
    ],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("API is running successfully 🚀");
});

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", commentsRoutes);
app.use("/api", likesRoutes);
app.use("/api", tagRoutes);
app.use("/api", postQueryRoutes);
app.use("/api", aiRoutes);

// app.listen(process.env.PORT, () => {
//     console.log(`server is running on port ${process.env.PORT}`);
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

module.exports = app;
