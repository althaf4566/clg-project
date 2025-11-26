// signup.js

// Your asynchronous function to handle the API call (as provided)
async function handleSignUp(fullName, email, password) {
    try {
        const response = await fetch('https://clg-project-backend.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Success! Store the token and redirect the user
            localStorage.setItem('jobreckoToken', data.token);
            console.log('User registered. Token:', data.token);
            // NOTE: Ensure your home page path is correct (e.g., 'home.html')
            window.location.href = '../index.html'; 
        } else {
            // Failure. Display the error message from the backend
            alert('Sign-up failed: ' + data.msg);
        }
    } catch (error) {
        // This catches network issues (e.g., server is down, CORS error)
        console.error('Network Error:', error);
        alert('Could not connect to the server. Please ensure the backend is running at http://localhost:3000.');
    }
}

// Function to handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    // Attach an event listener to the form's submit event
    signupForm.addEventListener('submit', (event) => {
        // Prevent the default form submission (which reloads the page)
        event.preventDefault(); 
        
        // 1. Capture data from the input fields using their IDs
        const fullNameInput = document.getElementById('fullName').value.trim();
        const emailInput = document.getElementById('email').value.trim();
        const passwordInput = document.getElementById('password').value;

        // 2. Simple client-side validation (optional)
        if (!fullNameInput || !emailInput || !passwordInput) {
            alert('Please fill out all fields.');
            return;
        }

        // 3. Call your sign-up handler function
        handleSignUp(fullNameInput, emailInput, passwordInput);
    });
});