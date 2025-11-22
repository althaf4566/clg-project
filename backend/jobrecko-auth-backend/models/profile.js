// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    // Link the profile to a User ID (assuming user authentication)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Link to your User model
        required: true
    },
    
    // Core Technical Percentages
    OS_percent: { type: Number, min: 0, max: 100, required: true },
    Algorithms_percent: { type: Number, min: 0, max: 100, required: true },
    Programming_percent: { type: Number, min: 0, max: 100, required: true },
    SE_percent: { type: Number, min: 0, max: 100, required: true },
    Networks_percent: { type: Number, min: 0, max: 100, required: true },
    Electronics_percent: { type: Number, min: 0, max: 100, required: true },
    Architecture_percent: { type: Number, min: 0, max: 100, required: true },
    Math_percent: { type: Number, min: 0, max: 100, required: true },
    Comm_percent: { type: Number, min: 0, max: 100, required: true },
    
    // Experience and Rating Metrics
    Logical_Rating: { type: Number, min: 1, max: 10, required: true },
    Coding_Rating: { type: Number, min: 1, max: 10, required: true },
    Hackathons_Count: { type: Number, min: 0, required: true },
    Workshops: { type: Number, min: 0, required: true },
    Memory_Score: { type: Number, min: 1, max: 10, required: true },
    Teamwork_Exp: { type: Number, min: 1, max: 5, required: true },
    Interested_Subjects: { type: [String] }, // Store as an array of strings
    
    // Career Goals & Self-Assessment
    Self_Learning: { type: Number, min: 1, max: 5, required: true },
    Goal: { type: String, required: true },
    Senior_Input: { type: Number, min: 1, max: 10, required: true },
    Preference_Type: { type: String, required: true },
    
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('Profile', ProfileSchema);