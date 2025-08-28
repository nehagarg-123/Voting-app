const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the Person schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
     photo: {
        type: String // This will store a URL to the candidate's image
    },
    votes:[{
        user:{
            //id that will give the mongoose so i wrote like that
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        votedAt:{
            type:Date,
            default:Date.now()

        }
    }

    ],
    voteCount: {
        type: Number,
        default: 0
    }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
