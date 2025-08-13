const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");

// Helper function to emit updated results
async function sendUpdatedResults(io) {
    const candidates = await Candidate.find();
    const results = {};
    candidates.forEach(c => {
        results[c.name] = c.voteCount;
    });
    io.emit("update_results", results);
}

// POST /vote/:id → increment candidate votes
router.post("/:id", async (req, res) => {
    try {
        const candidateId = req.params.id;
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        candidate.voteCount += 1;
        await candidate.save();

        // Emit updated results to all clients
        const io = req.app.get("socketio");
        await sendUpdatedResults(io);

        res.json({ message: "Vote recorded successfully" });
    } catch (err) {
        console.error("Error recording vote:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/results', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const results = {};
    candidates.forEach(c => {
      results[c.name] = c.voteCount; // or c.votes.length if you store in array
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
