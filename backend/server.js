const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 5000');
})
