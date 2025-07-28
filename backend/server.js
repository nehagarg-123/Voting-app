import express from 'express';
import 'dotenv/config'; // Handles environment variables
import db from './db.js';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

const app = express();
app.use(express.json()); // Modern way to handle JSON body, replaces body-parser

const PORT = process.env.PORT || 5000;

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});