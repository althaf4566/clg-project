document.addEventListener('DOMContentLoaded', () => {
    // 🟢 CHANGE: Updated ID to match the new button in HTML
    const validateAndGenerateBtn = document.getElementById('validateAndGenerateBtn'); 
    const printBtn = document.getElementById('printBtn');
    const resumePreview = document.getElementById('resumePreview');
    const userPhotoInput = document.getElementById('userPhoto');
    const resumeForm = document.getElementById('resumeForm'); // Reference to the entire form
    let photoURL = '';
    const STORAGE_KEY = 'resumeMakerData'; // Key for localStorage

    // --- Action Verb List for ATS Validation ---
    const ACTION_VERBS = [
        'achieved', 'analyzed', 'built', 'created', 'developed', 'established',
        'expanded', 'facilitated', 'focused', 'generated', 'implemented', 'improved', 
        'initiated', 'integrated', 'launched', 'led', 'managed', 'maximized', 
        'negotiated', 'optimized', 'pioneered', 'produced', 'reduced', 'resolved', 
        'secured', 'sold', 'streamlined', 'trained', 'utilized', 'coached', 'directed', 
        'designed', 'executed', 'innovated', 'oversaw', 'spearheaded', 'collaborated', 
        'mentored', 'authored', 'compiled', 'delegated', 'drove', 'engineered', 'founded'
    ];
    // --------------------------------------

    // --- 💾 Save Functionality (Saves form data to localStorage) ---
    const saveFormData = () => {
        const data = {};
        const formElements = resumeForm.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            if (element.id) {
                data[element.id] = element.value;
            }
        });
        
        // Save photo URL separately if it exists
        if (photoURL) {
            data['userPhotoURL'] = photoURL;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Could not save data to local storage:", e);
        }
    };

    // --- 💾 Load Functionality (Loads form data from localStorage) ---
    const loadFormData = () => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const data = JSON.parse(storedData);
                
                // Populate form fields
                for (const id in data) {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = data[id];
                    }
                }
                
                // Handle Photo URL separately
                if (data['userPhotoURL']) {
                    photoURL = data['userPhotoURL'];
                }
            }
        } catch (e) {
            console.error("Could not load data from local storage:", e);
        }
    };

    // --- Event Listeners for Saving on Input/Change ---
    resumeForm.addEventListener('input', saveFormData);
    resumeForm.addEventListener('change', saveFormData);

    // --- Photo Handling ---
    userPhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoURL = e.target.result;
                saveFormData(); // Save photoURL immediately after loading
                generatePreview();
            };
            reader.readAsDataURL(file);
        } else {
            photoURL = '';
            saveFormData(); // Clear photoURL from storage if file is cleared
            generatePreview();
        }
    });

    // --- Validation and Generation Trigger ---
    validateAndGenerateBtn.addEventListener('click', () => {
        if (runAtsValidation()) {
            generatePreview();
        }
    });

    /**
     * Checks if experience bullet points start with strong action verbs.
     * Provides a warning if the check fails.
     */
    function runAtsValidation() {
        const exp1_desc = document.getElementById('exp1_desc').value.toLowerCase();
        const exp2_desc = document.getElementById('exp2_desc').value.toLowerCase(); 

        let validationFailed = false;

        const checkDescription = (desc) => {
            // Split by newline, filter out empty lines, and trim
            const lines = desc.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            for (const line of lines) {
                // Get the first word, remove punctuation (like commas/periods)
                const firstWord = line.split(' ')[0].replace(/[.,:;]/g, '');
                if (firstWord && !ACTION_VERBS.includes(firstWord)) {
                    validationFailed = true;
                    // Stop checking this section once a fail is found
                    return true; 
                }
            }
            return false;
        };

        checkDescription(exp1_desc);
        checkDescription(exp2_desc);

        if (validationFailed) {
            alert("⚠️ ATS Optimization Warning: Your resume is ATS-Ready, but we recommend you check your **Experience** section(s). Please start **ALL** descriptive bullet points with a strong **Action Verb** (e.g., 'Developed', 'Managed', 'Achieved') for the highest ATS compatibility.");
        }
        
        // Always return true to proceed with generating the preview, 
        // as this is a warning, not a hard stop validation.
        return true; 
    }


    // --- Resume Generation Function (Updated to include Experience 2) ---
    const generatePreview = () => {
        const template = document.getElementById('templateSelector').value;
        resumePreview.className = 'resume-output ' + template; 
        
        // 1. Gather all form data
        const data = {
            fullName: document.getElementById('fullName').value,
            jobTitleHeader: document.getElementById('jobTitleHeader').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            website: document.getElementById('website').value,
            profileSummary: document.getElementById('profileSummary').value,
            
            // Experience 1
            exp1_title: document.getElementById('exp1_title').value,
            exp1_company: document.getElementById('exp1_company').value,
            exp1_desc: document.getElementById('exp1_desc').value,

            // Experience 2 🟢 NEW: Added exp2 fields
            exp2_title: document.getElementById('exp2_title').value,
            exp2_company: document.getElementById('exp2_company').value,
            exp2_desc: document.getElementById('exp2_desc').value,

            // Education/Skills/References
            edu1_degree: document.getElementById('edu1_degree').value,
            edu1_university: document.getElementById('edu1_university').value,
            edu1_gpa: document.getElementById('edu1_gpa').value,
            skills: document.getElementById('skills').value,
            languages: document.getElementById('languages').value,
            ref1_name: document.getElementById('ref1_name').value,
            ref1_title: document.getElementById('ref1_title').value,
            ref1_contact: document.getElementById('ref1_contact').value,
        };
        
        // 2. Process data for HTML formatting
        const exp1Bullets = data.exp1_desc ? data.exp1_desc.split('\n').map(line => line.trim()).filter(line => line.length > 0) : [];
        const exp1BulletsHtml = exp1Bullets.map(line => `<li>${line}</li>`).join('');

        const exp2Bullets = data.exp2_desc ? data.exp2_desc.split('\n').map(line => line.trim()).filter(line => line.length > 0) : [];
        const exp2BulletsHtml = exp2Bullets.map(line => `<li>${line}</li>`).join('');

        const skillsList = data.skills ? data.skills.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [];
        const skillsHtml = skillsList.map(skill => `<li>${skill}</li>`).join('');

        const languagesList = data.languages ? data.languages.split('\n').map(l => l.trim()).filter(l => l.length > 0) : [];
        const languagesHtml = languagesList.map(lang => `<li>${lang}</li>`).join('');

        const photoHtml = photoURL ? `<div class="user-photo-container"><img src="${photoURL}" class="user-photo" alt="User Photo"></div>` : '';
        
        let htmlContent;

        if (template === 'template-image') {
            // --- Template 1: Two-Column Image Style (Updated to include Exp 2) ---
            htmlContent = `
                <div class="resume-sidebar">
                    ${photoHtml}
                    <div class="sidebar-section">
                        <h3>CONTACT</h3>
                        <p class="contact-item"><i class="fas fa-phone-alt"></i> ${data.phoneNumber || '[Phone Number]'}</p>
                        <p class="contact-item"><i class="fas fa-envelope"></i> ${data.email || '[Email Address]'}</p>
                        <p class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address || '[Address]'}</p>
                        <p class="contact-item"><i class="fas fa-globe"></i> ${data.website || '[Website / LinkedIn]'}</p>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>EDUCATION</h3>
                        <div class="education-item">
                            <p class="years">${data.edu1_university.split(',')[1]?.trim() || '2029 - 2030'}</p>
                            <p class="degree">${data.edu1_degree || 'Master of Business Management'}</p>
                            <p class="university">${data.edu1_university.split(',')[0]?.trim() || 'WARDIERE UNIVERSITY'}</p>
                            <p class="gpa">${data.edu1_gpa || 'GPA: 3.8 / 4.0'}</p>
                        </div>
                    </div>

                    <div class="sidebar-section">
                        <h3>SKILLS</h3>
                        <ul class="sidebar-list">
                            ${skillsHtml || '<li>Skill 1</li><li>Skill 2</li>'}
                        </ul>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>LANGUAGES</h3>
                        <ul class="sidebar-list">
                            ${languagesHtml || '<li>Language 1</li><li>Language 2</li>'}
                        </ul>
                    </div>
                </div>

                <div class="resume-main-content">
                    <header class="main-header">
                        <h1>${data.fullName || 'YOUR FULL NAME'}</h1>                      
                        <p class="job-title-header">${data.jobTitleHeader || 'Your Professional Title'}</p>
                    </header>
                    
                    <div class="main-content-section">
                        <h3>PROFESSIONAL SUMMARY</h3>
                        <p class="profile-summary">${data.profileSummary || 'A dynamic and results-driven professional...'}</p>
                    </div>

                    <div class="main-content-section">
                        <h3>WORK EXPERIENCE</h3>
                        
                        ${data.exp1_title ? `
                        <div class="experience-item">
                            <p class="job-title-exp">${data.exp1_title.split('/')[0]?.trim() || 'Your Professional Title'}</p>
                            <p class="company-duration-exp">${data.exp1_company || 'Company Name / Duration'}</p>
                            <ul>
                                ${exp1BulletsHtml || '<li>Develop and execute comprehensive strategies.</li>'}
                            </ul>
                        </div>
                        ` : ''}

                        ${data.exp2_title ? `
                        <div class="experience-item">
                            <p class="job-title-exp">${data.exp2_title.split('/')[0]?.trim() || 'Your Previous Role'}</p>
                            <p class="company-duration-exp">${data.exp2_company || 'Previous Company / Duration'}</p>
                            <ul>
                                ${exp2BulletsHtml || '<li>Streamlined processes for efficiency and cost reduction.</li>'}
                            </ul>
                        </div>
                        ` : ''}
                        
                        ${!data.exp1_title && !data.exp2_title ? '<p style="font-style: italic; color: #6c757d;">Add your work experience to see it here.</p>' : ''}
                    </div>
                    
                    <div class="main-content-section">
                        <h3>REFERENCE</h3>
                        <div class="references-container">
                            ${data.ref1_name ? `
                            <div class="reference-item">
                                <p class="ref-name">${data.ref1_name || 'Estelle Darcy'}</p>
                                <p class="ref-title-company">${data.ref1_title || 'Wardiere Inc. / CTO'}</p>
                                <p class="ref-contact">${data.ref1_contact || 'Phone: 123-456-7890'}</p>
                            </div>
                            ` : '<p style="font-style: italic; color: #6c757d;">References available upon request.</p>'}
                        </div>
                    </div>
                </div>
            `;
        } else if (template === 'modern-default') {
            // --- Template 2: Existing Modern (Two-Column) Template HTML (Updated to include Exp 2) ---
            htmlContent = `
                <div class="resume-sidebar">
                    ${photoHtml}
                    <div class="sidebar-section">
                        <h3>CONTACT</h3>
                        <p class="contact-item">${data.phoneNumber || '[Phone Number]'}</p>
                        <p class="contact-item">${data.email || '[Email Address]'}</p>
                        <p class="contact-item">${data.address || '[Address]'}</p>
                        <p class="contact-item">${data.website || '[Website / LinkedIn]'}</p>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>EDUCATION</h3>
                        <p style="font-size: 0.8em; margin-top: 0;"><strong>${data.edu1_university || '[University Name]'}</strong></p>
                        <p style="font-size: 0.9em; margin-bottom: 5px;">${data.edu1_degree || '[Degree/Major]'}</p>
                        <p style="font-size: 0.8em; margin-top: 0;">${data.edu1_gpa || '[GPA]'}</p>
                    </div>

                    <div class="sidebar-section">
                        <h3>SKILLS</h3>
                        <ul class="sidebar-list">
                            ${skillsHtml || '<li>Skill 1</li><li>Skill 2</li>'}
                        </ul>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>LANGUAGES</h3>
                        <ul class="sidebar-list">
                            ${languagesHtml || '<li>Language 1</li><li>Language 2</li>'}
                        </ul>
                    </div>
                
                </div>
                <div class="resume-main-content">
                    <header class="main-header">
                        <h1>${data.fullName || 'YOUR FULL NAME'}</h1>
                        <p class="job-title-header">${data.jobTitleHeader || 'Your Professional Title'}</p>
                    </header>
                    
                    <div class="main-content-section">
                        <h3>PROFESSIONAL SUMMARY</h3>
                        <p class="profile-summary">${data.profileSummary || 'A dynamic and results-driven professional...'}</p>
                    </div>

                    <div class="main-content-section">
                        <h3>WORK EXPERIENCE</h3>
                        
                        ${data.exp1_title ? `
                        <div class="experience-item">
                            <p class="job-title-exp">${data.exp1_title.split('/')[0]?.trim() || 'Your Professional Title'}</p>
                            <p class="company-duration-exp">${data.exp1_company || 'Company Name / Duration'}</p>
                            <ul>
                                ${exp1BulletsHtml || '<li>Develop and execute comprehensive strategies.</li>'}
                            </ul>
                        </div>
                        ` : ''}

                        ${data.exp2_title ? `
                        <div class="experience-item">
                            <p class="job-title-exp">${data.exp2_title.split('/')[0]?.trim() || 'Your Previous Role'}</p>
                            <p class="company-duration-exp">${data.exp2_company || 'Previous Company / Duration'}</p>
                            <ul>
                                ${exp2BulletsHtml || '<li>Streamlined processes for efficiency and cost reduction.</li>'}
                            </ul>
                        </div>
                        ` : ''}
                        
                        ${!data.exp1_title && !data.exp2_title ? '<p style="font-style: italic; color: #6c757d;">Add your work experience to see it here.</p>' : ''}
                    </div>

                    <div class="main-content-section">
                        <h3>REFERENCE</h3>
                        <div class="references-container">
                            ${data.ref1_name ? `
                            <div class="reference-item">
                                <p class="ref-name">${data.ref1_name || 'Estelle Darcy'}</p>
                                <p class="ref-title-company">${data.ref1_title || 'Wardiere Inc. / CTO'}</p>
                                <p class="ref-contact">${data.ref1_contact || 'Phone: 123-456-7890'}</p>
                            </div>
                            ` : '<p style="font-style: italic; color: #6c757d;">References available upon request.</p>'}
                        </div>
                    </div>
                </div>
            `;
        } else if (template === 'classic') {
            // --- Template 3: Classic (Single-Column) Template HTML (Updated to include Exp 2) ---
            htmlContent = `
                <div class="resume-main-content">
                    <header class="main-header">
                        ${photoHtml}
                        <h1>${data.fullName || 'YOUR FULL NAME'}</h1>
                        <p class="job-title-header">${data.jobTitleHeader || 'Your Professional Title'}</p>
                    </header>
                    
                    <div class="contact-section">
                        <p class="contact-item"><i class="fas fa-phone-alt"></i> ${data.phoneNumber || '[Phone Number]'}</p>
                        <p class="contact-item"><i class="fas fa-envelope"></i> ${data.email || '[Email Address]'}</p>
                        <p class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address || '[Address]'}</p>
                        <p class="contact-item"><i class="fas fa-globe"></i> ${data.website || '[Website / LinkedIn]'}</p>
                    </div>

                    <div class="main-content-section">
                        <h3>PROFESSIONAL SUMMARY</h3>
                        <p class="profile-summary">${data.profileSummary || 'A dynamic and results-driven professional...'}</p>
                    </div>

                    <div class="main-content-section">
                        <h3>WORK EXPERIENCE</h3>
                        
                        ${data.exp1_title ? `
                        <div class="experience-item">
                            <p class="job-title-exp">${data.exp1_title.split('/')[0]?.trim() || 'Your Professional Title'}</p>
                            <p class="company-duration-exp">${data.exp1_company || 'Company Name / Duration'}</p>
                            <ul>
                                ${exp1BulletsHtml || '<li>Develop and execute comprehensive strategies.</li>'}
                            </ul>
                        </div>
                        ` : ''}

                        ${data.exp2_title ? `
                        <div class="experience-item">
                            <p class="job-title-exp">${data.exp2_title.split('/')[0]?.trim() || 'Your Previous Role'}</p>
                            <p class="company-duration-exp">${data.exp2_company || 'Previous Company / Duration'}</p>
                            <ul>
                                ${exp2BulletsHtml || '<li>Streamlined processes for efficiency and cost reduction.</li>'}
                            </ul>
                        </div>
                        ` : ''}
                        
                        ${!data.exp1_title && !data.exp2_title ? '<p style="font-style: italic; color: #6c757d;">Add your work experience to see it here.</p>' : ''}
                    </div>

                    <div class="main-content-section">
                        <h3>EDUCATION</h3>
                        <div class="education-item">
                            <p class="job-title-exp">${data.edu1_degree || 'Master of Business Management'}</p>
                            <p class="company-duration-exp">${data.edu1_university || 'WARDIERE UNIVERSITY, 2029 - 2030'}</p>
                            <p class="company-duration-exp">${data.edu1_gpa || 'GPA: 3.8 / 4.0'}</p>
                        </div>
                    </div>

                    <div class="main-content-section">
                        <h3>SKILLS</h3>
                        <ul class="sidebar-list">
                            ${skillsHtml || '<li>Skill 1</li><li>Skill 2</li>'}
                        </ul>
                    </div>
                    
                    <div class="main-content-section">
                        <h3>LANGUAGES</h3>
                        <ul class="sidebar-list">
                            ${languagesHtml || '<li>Language 1</li><li>Language 2</li>'}
                        </ul>
                    </div>

                    <div class="main-content-section">
                        <h3>REFERENCE</h3>
                        <div class="references-container">
                            ${data.ref1_name ? `
                            <div class="reference-item">
                                <p class="ref-name">${data.ref1_name || 'Estelle Darcy'}</p>
                                <p class="ref-title-company">${data.ref1_title || 'Wardiere Inc. / CTO'}</p>
                                <p class="ref-contact">${data.ref1_contact || 'Phone: 123-456-7890'}</p>
                            </div>
                            ` : '<p style="font-style: italic; color: #6c757d;">References available upon request.</p>'}
                        </div>
                    </div>

                </div>
            `;
        } else {
            // Default placeholder if no template is selected
            htmlContent = '<p class="placeholder-text">Select a template and click "Optimize & Generate Preview" to see your resume.</p>';
        }
        
        // 3. Render the content
        resumePreview.innerHTML = htmlContent;

        // 4. Fallback for empty resume 
        if (template && !data.fullName && !data.profileSummary) {
            resumePreview.querySelector('.placeholder-text') || (resumePreview.innerHTML = '<p class="placeholder-text">Enter your details and click "Optimize & Generate Preview" to see your ATS-Ready resume.</p>');
        }
    };

    // Make sure the print button works
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // --- 🚀 Initial Call: Load data and generate preview on page load ---
    loadFormData();
    generatePreview(); 
});