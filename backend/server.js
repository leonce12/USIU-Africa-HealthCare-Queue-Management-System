const express = require("express");
const cors = require("cors");
const { getState } = require("./src/db");

const app = express();
app.use(cors());
app.use(express.json());
getState(); // warm the db file on boot

app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/queue", require("./src/routes/queue"));
app.use("/api/staff", require("./src/routes/staff"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Queue API running on http://localhost:${PORT}`));
