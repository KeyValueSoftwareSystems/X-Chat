(() => {
  const messagesEl = document.getElementById('messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  const statusEl = document.getElementById('status');

  const userIdKey = 'cs_user_id';
  let userId = localStorage.getItem(userIdKey);
  if (!userId) {
    userId = 'user-' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(userIdKey, userId);
  }

  // Add loading indicator
  function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.className = 'msg assistant loading';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const avatarImg = document.createElement('img');
    avatarImg.src = 'assets/Clara.png';
    avatarImg.alt = 'Clara Johns';
    avatar.appendChild(avatarImg);
    
    const nameLabel = document.createElement('span');
    nameLabel.className = 'message-name';
    nameLabel.textContent = 'Clara Johns';
    
    messageHeader.appendChild(avatar);
    messageHeader.appendChild(nameLabel);
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `
      <div class="typing">
        <span>Thinking</span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    bubble.appendChild(messageHeader);
    bubble.appendChild(messageContent);
    loading.appendChild(bubble);
    messagesEl.appendChild(loading);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return loading;
  }

  // Remove loading indicator
  function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.remove();
  }

  function appendMessage(role, content, isSupport = false) {
    // Remove any existing loading indicator
    hideLoading();
    
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}${isSupport ? ' support' : ''}`;
    
    // Create bubble with header inside
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Create message header with avatar and name inside bubble
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const avatarImg = document.createElement('img');
    if (role === 'user') {
      avatarImg.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
      avatarImg.alt = 'User';
    } else {
      avatarImg.src = 'assets/Clara.png';
      avatarImg.alt = 'Clara Johns';
    }
    avatar.appendChild(avatarImg);
    
    const nameLabel = document.createElement('span');
    nameLabel.className = 'message-name';
    nameLabel.textContent = role === 'user' ? 'You' : 'Clara Johns';
    
    messageHeader.appendChild(avatar);
    messageHeader.appendChild(nameLabel);
    
    // Create content div
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    bubble.appendChild(messageHeader);
    bubble.appendChild(messageContent);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(text) {
    appendMessage('user', text);
    input.value = '';
    
    // Disable input while waiting
    input.disabled = true;
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.disabled = true;
    
    // Show loading indicator
    showLoading();

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userId })
      });

      const data = await res.json();
      if (!res.ok) {
        appendMessage('assistant', 'Sorry, something went wrong.');
        console.error('API error:', data);
        hideLoading();
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        return;
      }

      if (data.source === 'kb') {
        statusEl.textContent = 'Answered from Knowledge Base';
        appendMessage('assistant', data.answer || '(No answer)');
      } else if (data.source === 'escalated') {
        statusEl.textContent = 'Escalated to Support via Siren';
        appendMessage('assistant', data.message || "I've forwarded your question to our support team. We'll get back to you shortly.");
      } else {
        appendMessage('assistant', data.answer || 'Received.');
      }
    } catch (err) {
      console.error('Network error:', err);
      hideLoading();
      appendMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      // Re-enable input
      input.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      input.focus();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text);
  });

  // Connect to SSE endpoint
  function connectSSE() {
    const eventSource = new EventSource(`/api/events/${userId}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          appendMessage(data.role, data.content, data.isSupport);
        }
      } catch (e) {
        console.error('Error parsing SSE data:', e);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
      // Try to reconnect after 5 seconds
      setTimeout(connectSSE, 5000);
    };
    
    return eventSource;
  }
  
  // Initialize SSE connection
  let sseConnection = connectSSE();
  
  // Greet
  appendMessage('assistant', 'Hi! I am your customer support assistant. Ask me anything about orders, returns, shipping, and more.');
})();
