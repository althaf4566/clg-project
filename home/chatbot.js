// chatbot.js - Handles the AI Assistant overlay logic

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CHATBOT VARIABLES (Must be defined here)
    // These IDs are expected to be present in your HTML on all pages
    const topBarAiIcon = document.getElementById('topBarAiIcon'); 
    const chatWindow = document.getElementById('aiChatWindow'); 
    const closeBtn = document.getElementById('closeChatBtn');
    const userInput = document.getElementById('userInput'); 
    const sendBtn = document.getElementById('sendBtn');
    const chatBody = document.getElementById('chatBody');

    // --- CHATBOT CONNECTION LOGIC (Open/Close) ---
    if (topBarAiIcon && chatWindow) { 
        topBarAiIcon.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open') && userInput) {
                userInput.focus(); 
            }
        });
    }

    if (closeBtn && chatWindow) { 
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }

    // --- INPUT & SEND BUTTON LOGIC ---
    if (userInput && sendBtn) {
        userInput.addEventListener('input', () => {
            sendBtn.disabled = userInput.value.trim() === '';
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) {
                sendMessage();
            }
        });

        sendBtn.addEventListener('click', sendMessage);
    }
    
    // --- CORE CHAT FUNCTIONS ---

    function appendMessage(sender, text) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${sender}-message`;
        messageContainer.innerHTML = `<p>${text}</p>`; 
        chatBody.appendChild(messageContainer);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        
        userInput.value = '';
        sendBtn.disabled = true;

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message-container ai-message typing-indicator';
        typingIndicator.innerHTML = '<p>...</p>';
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        getAiResponse(message, typingIndicator);
    }

    // --- AI API Integration Placeholder ---
    async function getAiResponse(userMessage, typingIndicator) {
        // *** REPLACE WITH YOUR SECURE BACKEND API CALL ***
        
        const systemInstruction = `You are the JobRecko AI Assistant. Your knowledge is strictly limited to the functions and content of the JobRecko website.`;
        
        try {
            // Placeholder: Simulate AI response delay
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            let aiText = `I processed your request: "${userMessage}". I can assist you with job searching and resume making features.`;
            
            typingIndicator.remove();
            appendMessage('ai', aiText);

        } catch (error) {
            console.error('AI API Error:', error);
            typingIndicator.remove();
            appendMessage('ai', "I'm sorry, I encountered an error and cannot connect to the knowledge base.");
        }
    }
});