// routes/api/jobs.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); 
const Profile = require('../../models/profile');
const { check, validationResult } = require('express-validator');

// @route   POST /api/jobs/profile
// @desc    Create or update user profile
// @access  Private (Requires token)
router.post('/profile', [
    auth, // Middleware to ensure the user is logged in
    [
        // Basic validation for required fields
        check('OS_percent', 'OS percentage is required').not().isEmpty(),
        check('Goal', 'Career Goal is required').not().isEmpty(),
        check('Preference_Type', 'Job Type preference is required').not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Pull out all fields from the request body
    const { 
        Interested_Subjects, Goal, Preference_Type, 
        OS_percent, Algorithms_percent, Programming_percent, SE_percent, 
        Networks_percent, Electronics_percent, Architecture_percent, Math_percent, 
        Comm_percent, Logical_Rating, Coding_Rating, Hackathons_Count, Workshops, 
        Memory_Score, Teamwork_Exp, Self_Learning, Senior_Input 
    } = req.body;

    // Build profile object
    const profileFields = {
        user: req.user.id, // ID attached by the 'auth' middleware
        OS_percent, Algorithms_percent, Programming_percent, SE_percent, 
        Networks_percent, Electronics_percent, Architecture_percent, Math_percent, 
        Comm_percent, Logical_Rating, Coding_Rating, Hackathons_Count, Workshops, 
        Memory_Score, Teamwork_Exp, Self_Learning, Senior_Input, Goal, Preference_Type
    };
    
    // Split Interested_Subjects string into an array, cleaning up spaces
    if (Interested_Subjects) {
        profileFields.Interested_Subjects = Interested_Subjects.split(',').map(subject => subject.trim());
    }

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create new profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/jobs/search
// @desc    Trigger job recommendations using profile data and search filters
// @access  Private (Requires token)
router.post('/search', auth, async (req, res) => {
    const { Certifications, Career_Area, Company_Type } = req.body;
    
    try {
        // 1. Fetch the user's saved profile data 
        const userProfile = await Profile.findOne({ user: req.user.id });

        if (!userProfile) {
            return res.status(404).json({ msg: 'Profile not found. Please complete your profile first.' });
        }

        // 2. Prepare data for the ML/AI Model
        // You would typically send both the static profile data (userProfile)
        // and the dynamic search filters (Certifications, Career_Area, Company_Type)
        const mlInput = {
            profileData: userProfile.toObject(),
            searchFilters: req.body
        };

        // --- ML/AI INTEGRATION STEP ---
        // NOTE: Replace this mock logic with a call to your ML service or local model.
        // Example: await axios.post('http://localhost:8000/predict', mlInput);
        
        console.log('--- ML Model Input Ready ---');
        console.log(`Searching for: ${Career_Area} jobs, Company: ${Company_Type}`);
        console.log(`Profile Skill Score (OS): ${userProfile.OS_percent}`);
        
        // Mock ML/AI Output
        const mockRecommendations = [
            { title: "Senior AI Engineer", company: "DataRecko Solutions", match_score: 95, reason: "High Algorithms & Math score." },
            { title: "Cloud Security Specialist", company: "CyberGuard Corp", match_score: 88, reason: "Good Networks & SE score." },
            { title: "Full Stack Web Developer", company: "Web Services Inc.", match_score: 80, reason: "High Programming score." }
        ];

        // 3. Return the results
        res.json({
            msg: "Job recommendations generated successfully.",
            recommended_jobs: mockRecommendations
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during job search');
    }
});


module.exports = router;