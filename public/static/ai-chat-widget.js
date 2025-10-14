// AI Chat Widget - Auto-loads on all pages
(function() {
    'use strict';

    // Check if already loaded
    if (document.getElementById('ai-chat-container')) {
        return;
    }

    // Create chat HTML
    const chatHTML = `
        <!-- AI Chat Floating Button and Modal -->
        <div id="ai-chat-container">
            <!-- Floating Button -->
            <button id="ai-chat-btn" style="position: fixed; bottom: 120px; right: 32px; z-index: 9999; width: 64px; height: 64px; background: linear-gradient(to right, rgb(147, 51, 234), rgb(126, 34, 206)); border-radius: 50%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;">
                <i class="fas fa-robot text-white text-2xl"></i>
            </button>

            <!-- Chat Modal -->
            <div id="ai-chat-modal" class="fixed bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 hidden" style="bottom: 200px; right: 32px; width: 400px; max-height: 600px; z-index: 9999;">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-robot text-white text-xl"></i>
                        <div>
                            <h3 class="text-white font-bold text-lg">Asistente Yo Decreto</h3>
                            <p class="text-purple-200 text-xs">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button id="close-chat-btn" class="text-white hover:text-purple-200 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- Messages Container -->
                <div id="chat-messages" class="p-4 space-y-3 overflow-y-auto" style="height: 400px; background: linear-gradient(to bottom, #0f172a, #1e293b);">
                    <!-- Welcome message -->
                    <div class="flex items-start space-x-2">
                        <div class="bg-purple-600 rounded-full p-2 flex-shrink-0">
                            <i class="fas fa-robot text-white text-xs"></i>
                        </div>
                        <div class="bg-slate-800 rounded-lg px-4 py-2 max-w-[80%]">
                            <p class="text-slate-300 text-sm">¡Hola! Soy tu asistente de Yo Decreto. ¿En qué puedo ayudarte con tus decretos y agenda?</p>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4 bg-slate-900 rounded-b-2xl border-t border-slate-700">
                    <div class="flex items-center space-x-2 mb-2">
                        <input type="checkbox" id="include-portfolio" checked class="w-4 h-4 text-purple-600 rounded">
                        <label for="include-portfolio" class="text-slate-400 text-xs">Incluir mis datos (decretos, agenda)</label>
                    </div>
                    <div class="flex space-x-2">
                        <input
                            type="text"
                            id="chat-input"
                            placeholder="Escribe tu pregunta..."
                            class="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500 text-sm"
                        >
                        <button id="send-chat-btn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert into body when DOM is ready
    function insertChat() {
        const div = document.createElement('div');
        div.innerHTML = chatHTML;
        document.body.appendChild(div.firstElementChild);
        initializeChat();
    }

    function initializeChat() {
        const aiChatBtn = document.getElementById('ai-chat-btn');
        const aiChatModal = document.getElementById('ai-chat-modal');
        const closeChatBtn = document.getElementById('close-chat-btn');
        const chatInput = document.getElementById('chat-input');
        const sendChatBtn = document.getElementById('send-chat-btn');
        const chatMessages = document.getElementById('chat-messages');
        const includePortfolio = document.getElementById('include-portfolio');

        // Chat history storage
        let chatHistory = JSON.parse(localStorage.getItem('ai_chat_history') || '[]');
        const MAX_HISTORY = 10;

        // Toggle chat modal
        aiChatBtn.addEventListener('click', function() {
            aiChatModal.classList.toggle('hidden');
        });

        closeChatBtn.addEventListener('click', function() {
            aiChatModal.classList.add('hidden');
        });

        // Send message function
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            addMessageToChat(message, 'user');
            chatHistory.push({role: 'user', content: message});
            if (chatHistory.length > MAX_HISTORY * 2) {
                chatHistory = chatHistory.slice(-MAX_HISTORY * 2);
            }
            localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));

            chatInput.value = '';
            const loadingId = addMessageToChat('Pensando...', 'ai', true);

            try {
                const response = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        includePortfolioContext: includePortfolio.checked,
                        history: chatHistory.slice(-MAX_HISTORY * 2)
                    })
                });

                const data = await response.json();
                document.getElementById(loadingId).remove();

                if (data.success) {
                    const aiResponse = data.response;
                    chatHistory.push({role: 'assistant', content: aiResponse});
                    localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));

                    // Check if response contains action JSON
                    const tick = String.fromCharCode(96);
                    const startMarker = tick + tick + tick + 'json';
                    const endMarker = tick + tick + tick;
                    const startIdx = data.response.indexOf(startMarker);

                    if (startIdx !== -1) {
                        const jsonStart = startIdx + startMarker.length;
                        const endIdx = data.response.indexOf(endMarker, jsonStart);

                        if (endIdx !== -1) {
                            const jsonText = data.response.substring(jsonStart, endIdx).trim();
                            try {
                                const actionData = JSON.parse(jsonText);
                                addMessageToChat('Ejecutando acción...', 'ai');

                                const actionResponse = await fetch('/api/ai/action', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(actionData)
                                });

                                const actionResult = await actionResponse.json();
                                if (actionResult.success) {
                                    addMessageToChat(actionResult.message || '✅ Acción completada', 'ai');
                                } else {
                                    addMessageToChat('❌ Error: ' + (actionResult.error || 'Error desconocido'), 'ai');
                                }
                            } catch (err) {
                                console.error('Error parsing action JSON:', err);
                                addMessageToChat(aiResponse, 'ai');
                            }
                        } else {
                            addMessageToChat(aiResponse, 'ai');
                        }
                    } else {
                        addMessageToChat(aiResponse, 'ai');
                    }
                } else {
                    addMessageToChat('Error: ' + (data.error || 'No se pudo obtener respuesta'), 'ai');
                }
            } catch (error) {
                console.error('Chat error:', error);
                document.getElementById(loadingId).remove();
                addMessageToChat('Error de conexión. Intenta de nuevo.', 'ai');
            }
        }

        function addMessageToChat(text, sender, isLoading = false) {
            const messageId = 'msg-' + Date.now();
            const messageDiv = document.createElement('div');
            messageDiv.id = messageId;
            messageDiv.className = 'flex items-start space-x-2 ' + (sender === 'user' ? 'justify-end' : '');

            if (sender === 'ai') {
                messageDiv.innerHTML = `
                    <div class="bg-purple-600 rounded-full p-2 flex-shrink-0">
                        <i class="fas fa-robot text-white text-xs"></i>
                    </div>
                    <div class="bg-slate-800 rounded-lg px-4 py-2 max-w-[80%]">
                        <p class="text-slate-300 text-sm ${isLoading ? 'animate-pulse' : ''}">${text}</p>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="bg-purple-600 rounded-lg px-4 py-2 max-w-[80%]">
                        <p class="text-white text-sm">${text}</p>
                    </div>
                    <div class="bg-slate-700 rounded-full p-2 flex-shrink-0">
                        <i class="fas fa-user text-slate-300 text-xs"></i>
                    </div>
                `;
            }

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageId;
        }

        // Send on button click
        sendChatBtn.addEventListener('click', sendMessage);

        // Send on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Load when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertChat);
    } else {
        insertChat();
    }
})();
