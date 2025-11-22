// home.js - Handles Navigation Menu and general page interactions

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Variables
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const closeNavBtn = document.getElementById('close-nav');

    // --- NAVIGATION MENU LOGIC ---
    if (menuToggle && navMenu && closeNavBtn) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.add('show-nav');
        });

        closeNavBtn.addEventListener('click', () => {
            navMenu.classList.remove('show-nav');
        });

        // Optional: Close the menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-nav');
            });
        });
    }
    // All other page-specific logic (not chatbot related) goes here
});