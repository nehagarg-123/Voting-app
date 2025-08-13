const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');

const db = require('./db'); // MongoDB connection
const Candidate = require('./models/candidate'); // Only needed for results

// Middleware
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));
app.use(bodyParser.json());

// HTTP + Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});
app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('A user connected via WebSocket');
});

// Emit latest results periodically
const emitResults = async () => {
    try {
        const candidates = await Candidate.find();
        const results = {};
        candidates.forEach(c => {
            results[c.name] = c.voteCount;
        });
        io.emit("update_results", results);
    } catch (err) {
        console.error("Error emitting results:", err);
    }
};

// Emit chart data every 5 seconds
setInterval(emitResults, 5000);

// Routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);
app.use('/vote', voteRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
