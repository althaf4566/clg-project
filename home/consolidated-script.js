// consolidated-script.js - Handles Navigation, Tab Switching, Profile Save, and Job Search

const BACKEND_URL = 'http://localhost:3000/api/jobs'; // Base URL for consolidated routes

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

    // ===================================
    // 2. TAB SWITCHING LOGIC
    // ===================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentTabs = document.querySelectorAll('.content-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            
            // Deactivate all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            contentTabs.forEach(tab => tab.classList.remove('active'));

            // Activate target
            button.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ===================================
    // 3. PROFILE SAVE & TAB SWITCH
    // ===================================
    const profileForm = document.getElementById('profileForm');
    const findJobTabBtn = document.getElementById('findJobTabBtn');

    if (profileForm) {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            
            // Collect all 17 fields into the payload
            const payload = {
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
            };

            // Call the save function
            saveProfileData(payload);
        });
    }

    async function saveProfileData(profileData) {
        const token = localStorage.getItem('jobreckoToken');
        if (!token) {
            alert('Authentication required. Please log in.');
            window.location.href = 'login.html';
            return false;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/profile`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify(profileData) 
            });

            if (response.ok) {
                // Profile saved successfully, automatically switch to the Job Recommendation tab
                alert('Profile saved successfully! Moving you to the Job Finder.');
                findJobTabBtn.click(); // Programmatically click the "Get Jobs" button
                return true;
                
            } else {
                const errorText = await response.text(); 
                console.error('API Error Status:', response.status);
                console.error('API Error Response Body:', errorText);
                alert(`Error saving profile (Status: ${response.status}). Check console for details.`);
                return false;
            }

        } catch (error) {
            console.error('Network Error during profile save:', error);
            alert('Could not connect to the backend server.');
            return false;
        }
    }

    // ===================================
    // 4. JOB SEARCH & ML/AI INTEGRATION POINT
    // ===================================
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const searchPayload = {
                Certifications: document.getElementById('Certifications').value.trim(),
                Career_Area: document.getElementById('Career_Area').value,
                Company_Type: document.getElementById('Company_Type').value,
            };

            // --- ML/AI INTEGRATION POINT ---
            // This function sends the search filters AND the saved user profile 
            // data to your backend, which then contacts your ML model.
            fetchJobRecommendations(searchPayload);
            // ---------------------------------
        });
    }

    async function fetchJobRecommendations(searchFilters) {
        const token = localStorage.getItem('jobreckoToken');
        const resultsContainer = document.getElementById('jobResultsContainer');
        resultsContainer.innerHTML = '<p class="loading-message">🚀 Analyzing profile and searching for jobs with AI...</p>';

        try {
            // This API call hits the backend route designed to communicate with your ML model
            const response = await fetch(`${BACKEND_URL}/search`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify(searchFilters) 
            });

            const data = await response.json();

            if (response.ok) {
                if (data.recommended_jobs && data.recommended_jobs.length > 0) {
                    displayJobResults(data.recommended_jobs);
                } else {
                    resultsContainer.innerHTML = '<p class="initial-message">✅ AI found no perfect matches for your criteria. Try adjusting your filters!</p>';
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
            // Assuming the jobs array has objects like { title: '...', company: '...', match_score: '...' }
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