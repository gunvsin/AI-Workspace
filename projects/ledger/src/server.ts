import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Ledger entries — CRUD stubs (to be expanded)
let entries: any[] = [];

app.get("/api/entries", (_req, res) => {
  res.json(entries);
});

app.post("/api/entries", (req, res) => {
  const entry = {
    id: Date.now().toString(),
    description: req.body.description,
    amount: req.body.amount,
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  res.status(201).json(entry);
});

app.delete("/api/entries/:id", (req, res) => {
  const id = req.params.id;
  entries = entries.filter((e) => e.id !== id);
  res.json({ removed: true });
});

// Start server
app.listen(port, () => {
  console.log(`🪤 Ledgity Sovereign Ledger running at http://localhost:${port}`);
  console.log(`📍 Health: http://localhost:${port}/health`);
});