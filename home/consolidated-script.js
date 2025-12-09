// consolidated-script.js - Handles Navigation, Profile Data Collection, and Single Job Search

// === ML/AI CONNECTION POINT 1: API Endpoint Definition ===
// Change this URL to point to your specific ML/AI model endpoint if needed.
const BACKEND_URL = 'https://clg-project-backend.onrender.com/api/jobs'; // Base URL for consolidated routes

document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // 1. NAVIGATION LOGIC (Menu Toggle)
    // ===================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const closeNavBtn = document.getElementById('close-nav');

    if (menuToggle && navMenu && closeNavBtn) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.add('show-nav');
        });

        closeNavBtn.addEventListener('click', () => {
            navMenu.classList.remove('show-nav');
        });
    }

    // =======================================================
    // 2. COMBINED FORM SUBMISSION (Profile Save + Job Search)
    // =======================================================
    const combinedJobForm = document.getElementById('combinedJobForm');

    if (combinedJobForm) {
        combinedJobForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect ALL fields (Profile Data + Search Filters)
            const fullPayload = {
                // Profile Data Fields
                OS_percent: parseInt(document.getElementById('OS_percent').value),
                Algorithms_percent: parseInt(document.getElementById('Algorithms_percent').value),
                Programming_percent: parseInt(document.getElementById('Programming_percent').value),
                SE_percent: parseInt(document.getElementById('SE_percent').value),
                Networks_percent: parseInt(document.getElementById('Networks_percent').value),
                Electronics_percent: parseInt(document.getElementById('Electronics_percent').value),
                Architecture_percent: parseInt(document.getElementById('Architecture_percent').value),
                Math_percent: parseInt(document.getElementById('Math_percent').value),
                Comm_percent: parseInt(document.getElementById('Comm_percent').value),
                Logical_Rating: parseInt(document.getElementById('Logical_Rating').value),
                Coding_Rating: parseInt(document.getElementById('Coding_Rating').value),
                Hackathons_Count: parseInt(document.getElementById('Hackathons_Count').value),
                Workshops: parseInt(document.getElementById('Workshops').value),
                Memory_Score: parseInt(document.getElementById('Memory_Score').value),
                Teamwork_Exp: parseInt(document.getElementById('Teamwork_Exp').value),
                Interested_Subjects: document.getElementById('Interested_Subjects').value.trim(), 
                Goal: document.getElementById('Goal').value.trim(),
                Senior_Input: parseInt(document.getElementById('Senior_Input').value), 
                Self_Learning: parseInt(document.getElementById('Self_Learning').value),
                Preference_Type: document.getElementById('Preference_Type').value,

                // Search Filter Fields
                Certifications: document.getElementById('Certifications').value.trim(),
                Career_Area: document.getElementById('Career_Area').value,
                Company_Type: document.getElementById('Company_Type').value,
            };

            // Call the search function with the full combined payload
            fetchJobRecommendations(fullPayload);
        });
    }

    // === ML/AI CONNECTION POINT 2: Data Transfer and API Call ===
    async function fetchJobRecommendations(fullPayload) {
        const token = localStorage.getItem('jobreckoToken');
        const resultsContainer = document.getElementById('jobResultsContainer');
        resultsContainer.innerHTML = '<p class="loading-message">🚀 Analyzing profile and searching for jobs with AI...</p>';

        if (!token) {
            resultsContainer.innerHTML = '<p class="error-message">Authentication required. Please log in before searching.</p>';
            return;
        }

        try {
            // This is the core API call. The backend receives 'fullPayload'
            // and uses it to run the ML/AI job recommendation model.
            const response = await fetch(`${BACKEND_URL}/search`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify(fullPayload) 
            });

            const data = await response.json();

            if (response.ok) {
                if (data.recommended_jobs && data.recommended_jobs.length > 0) {
                    displayJobResults(data.recommended_jobs);
                } else {
                    resultsContainer.innerHTML = '<p class="initial-message">✅ AI found no perfect matches for your criteria. Try adjusting your inputs!</p>';
                }
            } else {
                resultsContainer.innerHTML = `<p class="error-message">❌ Error: ${data.msg || 'Failed to fetch recommendations from the server.'}</p>`;
                console.error('Job Search Error:', data);
            }

        } catch (error) {
            resultsContainer.innerHTML = '<p class="error-message">🌐 Network Error: Could not reach the job recommendation service.</p>';
            console.error('Network Error during job search:', error);
        }
    }

    // Placeholder function to display results
    function displayJobResults(jobs) {
        const resultsContainer = document.getElementById('jobResultsContainer');
        let html = '<h3>Top AI-Matched Jobs:</h3><ul>';
        jobs.forEach(job => {
            html += `
                <li class="job-card">
                    <strong>${job.title}</strong> at ${job.company}
                    <span class="score">Match: ${job.match_score || 'N/A'}%</span>
                </li>
            `;
        });
        html += '</ul>';
        resultsContainer.innerHTML = html;
    }
});