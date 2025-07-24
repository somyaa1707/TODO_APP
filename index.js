const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Task = require("./models/task");

const app = express();
dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ ROUTES

// GET /
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("index", {
      tasks: tasks,
      query: req.query || {}, // ✅ Pass query object to EJS
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// POST /add
app.post("/add", async (req, res) => {
  const { title, priority } = req.body;

  if (!title || !title.trim()) {
    return res.redirect("/?alert=empty");
  }

  await Task.create({ title, priority });
  res.redirect("/?alert=created");
});

// POST /edit
app.post("/edit/:id", async (req, res) => {
  const { title, priority } = req.body;

  if (!title || !title.trim()) {
    return res.redirect("/?alert=empty");
  }

  await Task.findByIdAndUpdate(req.params.id, { title, priority });
  res.redirect("/?alert=updated");
});

// POST /delete
app.post("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/?alert=deleted");
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
