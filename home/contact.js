document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    // Add an event listener for when the form is submitted
    form.addEventListener('submit', function(event) {
        // 1. Prevent the default form submission (which would try to send data)
        event.preventDefault();

        // 2. Display the pop-up message (alert is the simplest way for a mockup)
        alert('Thank you for your message! This is a successful mock submission. We will be in touch shortly.');

        // 3. Optional: Clear the form fields after the message is "sent"
        form.reset();
    });
});