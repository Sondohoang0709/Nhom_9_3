// === Cấu hình API ===
const GEMINI_API_KEY = 'AIzaSyByyPeebHSPSrfheTN3xJDHxj3qrbWygmg'; // Thay bằng API Key thật của bạn
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;


// === DOM Elements ===
const form = document.querySelector('.chat-form');
const input = document.querySelector('.message-input');
const chatBody = document.querySelector('.chat-body');

// === Gửi tin nhắn người dùng + gọi API ===
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (userMessage === '') return;

  // Hiển thị tin nhắn người dùng
  appendMessage('user', userMessage);
  input.value = '';

  // Hiển thị thinking
  const thinking = appendThinking();

  // Gửi yêu cầu đến Gemini API
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userMessage }]
        }]
      })
    });

    const data = await response.json();
    const reply =data.candidates[0].content.parts[0].text || "Sorry, I didn’t understand that.";
    thinking.remove();
    appendMessage('bot', reply);
  } catch (error) {
    thinking.remove();
    appendMessage('bot', '⚠️ Error: Unable to reach the server.');
    console.error('API Error:', error);
  }
});

// === Thêm tin nhắn vào giao diện ===
function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);

  const messageText = document.createElement('div');
  messageText.classList.add('message-text');
  messageText.textContent = text;

  messageDiv.appendChild(messageText);
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// === Hiển thị thinking indicator ===
function appendThinking() {
  const thinkingDiv = document.createElement('div');
  thinkingDiv.classList.add('message', 'bot-thinking');

  const indicator = document.createElement('div');
  indicator.classList.add('thinking-indicator');

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    indicator.appendChild(dot);
  }

  thinkingDiv.appendChild(indicator);
  chatBody.appendChild(thinkingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
  return thinkingDiv;
}
