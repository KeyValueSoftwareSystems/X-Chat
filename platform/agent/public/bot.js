(() => {
    const script = document.currentScript;
    const agentId = script.dataset.agentId;
  
    if (!agentId) {
      console.error('Chat widget: data-agent-id attribute is missing from script tag.');
      return;
    }
  
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
  
    const style = document.createElement('style');
    style.textContent = `
      /* Chat Container */
      .chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 600px;
        height: 700px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #e3e3e3;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
        box-sizing: border-box;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: bottom right;
      }
  
      .chat-container.closed {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        pointer-events: none;
        visibility: hidden;
      }
  
      /* Floating Chat Icon */
      .chat-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #000000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        outline: none;
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
        visibility: hidden;
      }
  
      .chat-icon.visible {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
        visibility: visible;
      }
  
      .chat-icon:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.1);
      }
  
      .chat-icon i {
        color: white;
        font-size: 24px;
      }
  
      /* Header */
      .chat-container .header {
        background: #ffffff;
        color: #37352f;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e9e9e7;
      }
  
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
  
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
      }
  
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      .header-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
  
      .chat-container .header h1 {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: #37352f;
        line-height: 1.2;
      }
  
      .subtext {
        font-size: 11px;
        color: #787774;
        line-height: 1.2;
      }
  
      .chat-container .status {
        font-size: 11px;
        color: #65b665;
        display: flex;
        align-items: center;
        gap: 4px;
      }
  
      .chat-container .status::before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        background: #65b665;
        border-radius: 50%;
      }
  
      /* Close Button */
      .close-chat {
        background: none;
        border: none;
        font-size: 18px;
        color: #999999;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
      }
  
      .close-chat:hover {
        background: #f5f5f5;
        color: #666666;
      }
  
      /* Messages Area */
      .chat {
        flex: 1;
        padding: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        position: relative;
      }
  
      .messages {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        padding: 16px;
        margin-bottom: 0;
        flex: 1;
        min-height: 0;
      }
  
      /* Message Styles */
      .msg {
        display: flex;
        width: 100%;
        margin-bottom: 12px;
      }
  
      /* Message slide-up animation */
      .msg.slide-up {
        opacity: 0;
        transform: translateY(15px);
        animation: slideUpMessage 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
  
      @keyframes slideUpMessage {
        0% {
          opacity: 0;
          transform: translateY(15px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
  
      .msg.user {
        justify-content: flex-end;
      }
  
      .msg.assistant {
        justify-content: flex-start;
      }
  
      .msg.loading {
        justify-content: flex-start;
      }
  
      .msg.error {
        justify-content: flex-start;
      }
  
      /* Message Header - now inside bubble */
      .message-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
  
      .msg.user .message-header {
        flex-direction: row;
      }
  
      .message-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
      }
  
      .message-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      .message-name {
        font-size: 12px;
        font-weight: 600;
        color: #37352f;
        line-height: 1;
      }
  
      .msg.user .message-name {
        color: white;
      }
  
      /* Message Bubbles */
      .bubble {
        max-width: 85%;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 13px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
        position: relative;
        z-index: 1;
        margin: 2px 0;
        box-shadow: none;
        background-clip: padding-box;
        -webkit-background-clip: padding-box;
        background-origin: padding-box;
      }
  
      .msg.user .bubble {
        background: #000000;
        color: white;
        border-radius: 16px;
      }
  
      .msg.assistant .bubble {
        background: #ffffff;
        color: #37352f;
        border-radius: 16px;
        border: 1px solid #e9e9e7;
        white-space: pre-wrap;
        word-wrap: break-word;
        position: relative;
        overflow: visible;
        background-image: none !important;
        background: #ffffff !important;
      }
  
      /* Support Message Styling */
      .msg.assistant.support .bubble {
        background: #ffffff !important;
        border: 1px solid #e9e9e7;
        border-radius: 16px;
        margin: 2px 0;
        position: relative;
        padding: 8px 12px;
        background-image: none !important;
      }
  
      .msg.assistant.support .bubble::before {
        content: '';
        display: none;
      }
  
      /* Loading Animation */
      .msg.loading .message-content {
        display: flex;
        align-items: center;
        color: #666666;
      }
  
      .typing {
        display: flex;
        align-items: center;
        gap: 3px;
        padding: 2px 0;
      }
  
      .typing span:first-child {
        font-size: 13px;
        color: #666666;
      }
  
      .typing span:not(:first-child) {
        height: 3px;
        width: 3px;
        margin: 0 0.5px;
        background-color: #999999;
        border-radius: 50%;
        opacity: 0.4;
        display: block;
      }
  
      .typing span:nth-child(2) {
        animation: 1.2s blink infinite 0.0s;
      }
  
      .typing span:nth-child(3) {
        animation: 1.2s blink infinite 0.2s;
      }
  
      .typing span:nth-child(4) {
        animation: 1.2s blink infinite 0.4s;
      }
  
      @keyframes blink {
        50% {
          opacity: 1;
        }
      }
  
      /* Message Composer */
      .composer {
        padding: 12px 16px 16px 16px;
        background: #ffffff;
        display: flex;
        gap: 8px;
        position: relative;
        z-index: 2;
        flex-shrink: 0;
      }
  
      #chat-form {
        width: 100%;
        position: relative;
        display: flex;
      }
  
      #message-input {
        padding: 15px 100px 15px 20px;
        border-radius: 25px;
        border: 2px solid #000000;
        background: #ffffff;
        color: #37352f;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        width: 100%;
      }
  
      #message-input:focus {
        border-color: #000000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
  
      #emoji-btn {
        position: absolute;
        right: 44px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        border: 0;
        background: transparent;
        color: #666666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, color 0.2s;
        font-size: 16px;
        width: 30px;
        height: 30px;
      }
  
      #emoji-btn:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #333333;
      }
  
      #send-btn {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        padding: 8px 12px;
        border-radius: 50%;
        border: 0;
        background: #000000;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        font-weight: 500;
        font-size: 14px;
        width: 30px;
        height: 30px;
      }
  
      #send-btn:hover {
        background: #333333;
      }
  
      /* Disabled State */
      #message-input:disabled,
      #send-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
  
      /* Loading Message */
      .msg.loading .bubble {
        background: #ffffff;
        border: 1px solid #e9e9e7;
        border-radius: 16px;
        padding: 6px 10px;
      }
  
      /* Error Message */
      .msg.error .bubble {
        background: #fff5f5;
        border: 1px solid #fed7d7;
        border-radius: 16px;
        color: #e53e3e;
      }
  
      /* Scrollbar */
      .messages::-webkit-scrollbar {
        width: 4px;
      }
  
      .messages::-webkit-scrollbar-track {
        background: transparent;
      }
  
      .messages::-webkit-scrollbar-thumb {
        background: #d3d3d1;
        border-radius: 2px;
      }
  
      .messages::-webkit-scrollbar-thumb:hover {
        background: #a8a8a6;
      }
  
      /* Responsive Design */
      @media (max-width: 768px) {
        .chat-container {
          width: 90%;
          right: 5%;
          bottom: 1rem;
          max-width: none;
        }
      }
    `;
    shadowRoot.appendChild(style);
  
    const fontAwesome = document.createElement('link');
    fontAwesome.setAttribute('rel', 'stylesheet');
    fontAwesome.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
    shadowRoot.appendChild(fontAwesome);
  
    const chatIcon = document.createElement('button');
    chatIcon.id = 'chat-icon';
    chatIcon.className = 'chat-icon';
    chatIcon.innerHTML = `<i class="far fa-comment-dots"></i>`;
    shadowRoot.appendChild(chatIcon);
  
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
      <div class="header">
        <div class="header-left">
          <div class="avatar">
            <img src="assets/Clara.png" alt="Clara Johns" />
          </div>
          <div class="header-info">
            <h1>Clara Johns</h1>
            <span class="subtext">Customer Support</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="status" class="status">Online</span>
          <button class="close-chat" id="close-chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <section class="chat">
        <div id="messages" class="messages"></div>
      </section>
      <section class="composer">
        <form id="chat-form">
          <input id="message-input" type="text" placeholder="Type your message..." autocomplete="off" />
          <button id="emoji-btn" type="button">
            <i class="far fa-smile"></i>
          </button>
          <button id="send-btn" type="submit">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </section>
    `;
    shadowRoot.appendChild(chatContainer);
  
    const messagesEl = shadowRoot.getElementById('messages');
    const form = shadowRoot.getElementById('chat-form');
    const input = shadowRoot.getElementById('message-input');
    const closeBtn = shadowRoot.getElementById('close-chat');
  
    let isChatOpen = false;
  
    function closeChat() {
      chatContainer.classList.add('closed');
      chatIcon.classList.add('visible');
      isChatOpen = false;
    }
  
    function openChat() {
      chatContainer.classList.remove('closed');
      chatIcon.classList.remove('visible');
      isChatOpen = true;
    }
  
    closeChat();
  
    if (closeBtn) {
      closeBtn.addEventListener('click', closeChat);
    }
  
    if (chatIcon) {
      chatIcon.addEventListener('click', openChat);
    }
  
    const userIdKey = 'cs_user_id';
    let userId = localStorage.getItem(userIdKey);
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(userIdKey, userId);
    }
  
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
  
    function hideLoading() {
      const loading = shadowRoot.getElementById('loading');
      if (loading) loading.remove();
    }
  
    function appendMessage(role, content, isSupport = false, withAnimation = true) {
      hideLoading();
  
      const wrap = document.createElement('div');
      wrap.className = `msg ${role}${isSupport ? ' support' : ''}${withAnimation ? ' slide-up' : ''}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
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
      
      input.disabled = true;
      const sendBtn = shadowRoot.getElementById('send-btn');
      if (sendBtn) sendBtn.disabled = true;
      
      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/
      if (!emailRegex.test(text)) {
        setTimeout(() => {
          showLoading();
        }, 450);
      }
  
      try {
        const res = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, conversationId: userId, agentId })
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
  
        if (data.success) {
          if (data.email) {
              hideLoading();
          }
          appendMessage('assistant', data.response || 'No response received.');
        } else {
          appendMessage('assistant', data.error || 'Something went wrong.');
        }
      } catch (err) {
        console.error('Network error:', err);
        hideLoading();
        appendMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      } finally {
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
  
    function connectSSE() {
      const eventSource = new EventSource(`http://localhost:3001/api/events/${userId}`);
      
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
        setTimeout(connectSSE, 5000);
      };
      
      return eventSource;
    }
    
    let sseConnection = connectSSE();
    
    setTimeout(() => {
      appendMessage('assistant', 'Hey I am Clara 👋 How can I help you today?');
    }, 1500);
  
    if (chatIcon) {
      chatIcon.addEventListener('click', async () => {
        openChat();
        try {
          const res = await fetch('http://localhost:3001/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
          });
  
          if (!res.ok) {
            console.error('Failed to trigger workflow:', await res.text());
          }
        } catch (err) {
          console.error('Error triggering workflow:', err);
        }
      });
    }
  })();
  