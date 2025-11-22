// login.js

// The core function to send login data to the backend API
async function handleLogin(email, password) {
    try {
        // NOTE: Ensure your backend server is running at http://localhost:3000
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send email and password in the request body
            body: JSON.stringify({ email, password }),
        });

        // Parse the JSON response from the server
        const data = await response.json();

        if (response.ok) {
            // Success! The server returned a 200/201 status.
            
            // 1. Store the JWT token for session management
            localStorage.setItem('jobreckoToken', data.token);
            
            // 2. Log success and redirect
            console.log('Login successful. Token:', data.token);
            window.location.href = 'home.html'; // Redirect to the user's main dashboard or home page
        } else {
            // Failure. The server returned a 4xx error (e.g., Invalid Credentials)
            // Display the specific error message provided by the backend
            alert('Login failed: ' + data.msg);
        }
    } catch (error) {
        // This catches network issues (e.g., server is down, no internet connection)
        console.error('Network Error:', error);
        alert('Could not connect to the authentication server. Please try again.');
    }
}

// Event listener to handle the form submission
document.addEventListener('DOMContentLoaded', () => {
    // Get the login form element by its ID (You must define this ID in your HTML)
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        // Attach an event listener to the form's submit action
        loginForm.addEventListener('submit', (event) => {
            // 1. Prevent the browser's default form submission (which reloads the page)
            event.preventDefault(); 
            
            // 2. Capture data from the input fields using their IDs
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value;

            // 3. Simple validation
            if (!emailInput || !passwordInput) {
                alert('Please enter both email and password.');
                return;
            }

            // 4. Call the handler function
            handleLogin(emailInput, passwordInput);
        });
    }
});