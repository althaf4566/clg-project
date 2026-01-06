// consolidated-script.js - Updated for Flask Integration
const BACKEND_URL = '/api/jobs'; // Points to your local Flask route

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NAVIGATION LOGIC
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const closeNavBtn = document.getElementById('close-nav');

    if (menuToggle && navMenu && closeNavBtn) {
        menuToggle.addEventListener('click', () => navMenu.classList.add('show-nav'));
        closeNavBtn.addEventListener('click', () => navMenu.classList.remove('show-nav'));
    }

    // 2. FORM SUBMISSION & ML PREDICTION
    const combinedJobForm = document.getElementById('combinedJobForm');
    const resultsContainer = document.getElementById('jobResultsContainer');

    if (combinedJobForm) {
        combinedJobForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Show loading state
            resultsContainer.innerHTML = '<p class="loading-message">🤖 AI is analyzing your profile...</p>';

            // Collect data from HTML IDs
            const formData = {
                OS_percent: document.getElementById('OS_percent').value,
                Algorithms_percent: document.getElementById('Algorithms_percent').value,
                Programming_percent: document.getElementById('Programming_percent').value,
                SE_percent: document.getElementById('SE_percent').value,
                Networks_percent: document.getElementById('Networks_percent').value,
                Electronics_percent: document.getElementById('Electronics_percent').value,
                Architecture_percent: document.getElementById('Architecture_percent').value,
                Math_percent: document.getElementById('Math_percent').value,
                Comm_percent: document.getElementById('Comm_percent').value,
                Logical_Rating: document.getElementById('Logical_Rating').value,
                Hackathons_Count: document.getElementById('Hackathons_Count').value,
                Coding_Rating: document.getElementById('Coding_Rating').value,
                Certifications: document.getElementById('Certifications').value,
                Workshops: document.getElementById('Workshops').value,
                Interested_Subjects: document.getElementById('Interested_Subjects').value,
                Career_Area: document.getElementById('Career_Area').value,
                Company_Type: document.getElementById('Company_Type').value,
                // These handle the categorical logic from demo5_dwnld.py
                Self_Learning: "yes", 
                Extra_courses: "yes",
                Goal: "job",
                Senior_Input: "yes",
                Teamwork_Exp: "yes"
            };

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    displayJobResults(data.recommended_jobs);
                } else {
                    resultsContainer.innerHTML = `<p class="error-message">❌ Error: ${data.msg}</p>`;
                }
            } catch (error) {
                resultsContainer.innerHTML = '<p class="error-message">🌐 Connection Error: Is your Flask server running?</p>';
                console.error('Fetch error:', error);
            }
        });
    }

    function displayJobResults(jobs) {
        if (!jobs || jobs.length === 0) {
            resultsContainer.innerHTML = '<p class="initial-message">No matches found.</p>';
            return;
        }

        let html = '<h3 style="margin-bottom:15px;">Top AI-Matched Job:</h3>';
        jobs.forEach(job => {
            html += `
                <div class="job-card" style="border-left: 5px solid #1a73e8; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="flex-grow: 1;">
                        <strong style="font-size: 1.2rem; color: #1a73e8;">${job.title}</strong><br>
                        <small style="color: #666;">Category: ${job.company}</small>
                    </div>
                    <div style="text-align: right;">
                        <span class="score" style="background: #1a73e8; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold;">
                            ${job.match_score}% Match
                        </span>
                    </div>
                </div>
            `;
        });
        resultsContainer.innerHTML = html;
    }
});