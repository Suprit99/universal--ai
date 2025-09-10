class AIModelComparison {
    constructor() {
        this.apiKey = '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';
        this.currentColumns = 3;
        this.availableModels = [
            { id: 'openai/gpt-4o', name: 'GPT-4o', icon: 'G', color: '#10a37f', supportsVision: true },
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', icon: 'G', color: '#10a37f', supportsVision: true },
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', icon: 'C', color: '#cc785c', supportsVision: true },
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', icon: 'C', color: '#cc785c', supportsVision: true },
            { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', icon: 'G', color: '#4285f4', supportsVision: true },
            { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', icon: 'D', color: '#1a73e8', supportsVision: false },
            { id: 'perplexity/llama-3.1-sonar-large-128k-online', name: 'Perplexity Sonar', icon: 'P', color: '#20b2aa', supportsVision: false },
            { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', icon: 'L', color: '#0866ff', supportsVision: false },
            { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', icon: 'L', color: '#0866ff', supportsVision: false },
            { id: 'mistralai/mistral-large', name: 'Mistral Large', icon: 'M', color: '#ff7000', supportsVision: false }
        ];
        this.selectedBestResponse = null;
        this.selectedModels = [];
        this.conversationHistory = [];
        this.uploadedImages = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateModelColumns();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // Column count selector
        document.getElementById('columnCount').addEventListener('change', (e) => {
            this.currentColumns = parseInt(e.target.value);
            this.generateModelTabs();
            this.initializeSelectedModels();
        });


        // Message input - Enter key handling
        document.getElementById('messageInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send button
        document.getElementById('sendButton').addEventListener('click', () => {
            this.sendMessage();
        });

        // New chat button
        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.newChat();
        });

        // Auto-resize textarea
        document.getElementById('messageInput').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });

        // Image upload functionality
        document.getElementById('uploadImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
    }

    handleImageUpload(event) {
        const files = Array.from(event.target.files);
        const uploadedImagesContainer = document.getElementById('uploadedImages');

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        file: file,
                        dataUrl: e.target.result,
                        name: file.name
                    };
                    
                    this.uploadedImages.push(imageData);
                    this.displayImagePreview(imageData);
                };
                reader.readAsDataURL(file);
            }
        });

        // Clear the file input
        event.target.value = '';
    }

    displayImagePreview(imageData) {
        const uploadedImagesContainer = document.getElementById('uploadedImages');
        
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        imagePreview.dataset.imageName = imageData.name;
        
        imagePreview.innerHTML = `
            <img src="${imageData.dataUrl}" alt="${imageData.name}">
            <button class="image-remove" onclick="aiComparison.removeImage('${imageData.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedImagesContainer.appendChild(imagePreview);
    }

    removeImage(imageName) {
        // Remove from uploaded images array
        this.uploadedImages = this.uploadedImages.filter(img => img.name !== imageName);
        
        // Remove from DOM
        const imagePreview = document.querySelector(`[data-image-name="${imageName}"]`);
        if (imagePreview) {
            imagePreview.remove();
        }
    }

    convertImageToBase64(imageData) {
        return imageData.dataUrl.split(',')[1];
    }

    generateModelTabs() {
        const grid = document.getElementById('modelsGrid');
        grid.className = `models-grid cols-${this.currentColumns}`;
        grid.innerHTML = '';

        for (let i = 0; i < this.currentColumns; i++) {
            const tab = this.createModelTab(i);
            grid.appendChild(tab);
        }
    }

    createModelTab(index) {
        const tab = document.createElement('div');
        tab.className = 'model-tab';
        tab.dataset.columnIndex = index;

        const defaultModel = this.availableModels[index % this.availableModels.length];

        tab.innerHTML = `
            <div class="model-info">
                <div class="model-icon" style="background-color: ${defaultModel.color}">
                    ${defaultModel.icon}
                </div>
                <select class="model-selector" data-column="${index}">
                    ${this.availableModels.map(model => 
                        `<option value="${model.id}" ${model.id === defaultModel.id ? 'selected' : ''}>${model.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="model-actions">
                <button class="action-btn-small pick-best-btn" onclick="aiComparison.pickBestResponse(${index})">Best</button>
                <button class="action-btn-small copy-btn" onclick="aiComparison.copyResponse(${index})">Copy</button>
            </div>
        `;

        // Add change listener for model selector
        const selector = tab.querySelector('.model-selector');
        selector.addEventListener('change', (e) => {
            const selectedModel = this.availableModels.find(m => m.id === e.target.value);
            const icon = tab.querySelector('.model-icon');
            icon.textContent = selectedModel.icon;
            icon.style.backgroundColor = selectedModel.color;
            this.updateSelectedModels();
        });

        return tab;
    }

    initializeSelectedModels() {
        this.selectedModels = [];
        for (let i = 0; i < this.currentColumns; i++) {
            const selector = document.querySelector(`select[data-column="${i}"]`);
            if (selector) {
                const model = this.availableModels.find(m => m.id === selector.value);
                this.selectedModels.push({...model, columnIndex: i});
            }
        }
    }

    updateSelectedModels() {
        this.initializeSelectedModels();
    }

    generateModelColumns() {
        this.generateModelTabs();
        this.initializeSelectedModels();
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            alert('Please enter a message');
            return;
        }


        // Clear previous best response selection
        this.clearBestResponse();

        // Disable send button
        const sendButton = document.getElementById('sendButton');
        sendButton.disabled = true;

        // Add user message to conversation
        this.addUserMessage(message);

        // Clear input and reset height
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Get selected models
        this.updateSelectedModels();

        // Create message row for responses
        const messageRow = this.createMessageRow();

        // Send requests to all models simultaneously
        const promises = this.selectedModels.map(model => this.sendToModel(model, message, messageRow));
        
        try {
            await Promise.allSettled(promises);
        } catch (error) {
            console.error('Error sending messages:', error);
        }

        // Re-enable send button
        sendButton.disabled = false;
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        
        let messageContent = `<strong>You:</strong> ${this.formatResponse(message)}`;
        
        // Add uploaded images to the user message display
        if (this.uploadedImages.length > 0) {
            const imagesHtml = this.uploadedImages.map(img => 
                `<img src="${img.dataUrl}" alt="${img.name}" style="max-width: 200px; max-height: 200px; margin: 8px 8px 0 0; border-radius: 8px; border: 1px solid var(--border-color);">`
            ).join('');
            messageContent += `<div style="margin-top: 12px;">${imagesHtml}</div>`;
        }
        
        userMessage.innerHTML = messageContent;
        messagesContainer.appendChild(userMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear uploaded images after sending
        this.uploadedImages = [];
        document.getElementById('uploadedImages').innerHTML = '';
    }

    createMessageRow() {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageRow = document.createElement('div');
        messageRow.className = `message-row cols-${this.currentColumns}`;
        
        // Create response containers for each model
        for (let i = 0; i < this.currentColumns; i++) {
            const responseContainer = document.createElement('div');
            responseContainer.className = 'model-response';
            responseContainer.dataset.columnIndex = i;
            
            const model = this.selectedModels[i];
            responseContainer.innerHTML = `
                <div class="response-header">
                    <div class="response-model">${model.name}</div>
                    <div class="response-actions">
                        <button class="action-btn-small pick-best-btn" onclick="aiComparison.pickBestResponse(${i}, this.closest('.message-row'))">Best</button>
                        <button class="action-btn-small copy-btn" onclick="aiComparison.copyResponse(${i}, this.closest('.message-row'))">Copy</button>
                    </div>
                </div>
                <div class="response-content" id="response-${i}-${Date.now()}">
                    <div class="loading">Generating response...</div>
                </div>
            `;
            
            messageRow.appendChild(responseContainer);
        }
        
        messagesContainer.appendChild(messageRow);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageRow;
    }

    newChat() {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = '';
        this.conversationHistory = [];
        this.clearBestResponse();
        
        // Clear uploaded images
        this.uploadedImages = [];
        document.getElementById('uploadedImages').innerHTML = '';
    }

    async sendToModel(model, message, messageRow) {
        const responseContainer = messageRow.querySelector(`[data-column-index="${model.columnIndex}"]`);
        const responseDiv = responseContainer.querySelector('.response-content');
        
        try {
            // Prepare message content with images if available and model supports vision
            let messageContent;
            
            if (this.uploadedImages.length > 0 && model.supportsVision) {
                // For vision models, create content array with text and images
                messageContent = [
                    {
                        type: "text",
                        text: message
                    }
                ];
                
                // Add images to the message
                this.uploadedImages.forEach(imageData => {
                    messageContent.push({
                        type: "image_url",
                        image_url: {
                            url: imageData.dataUrl
                        }
                    });
                });
            } else {
                // For text-only models or when no images are uploaded
                messageContent = message;
                
                // Show warning if images are uploaded but model doesn't support vision
                if (this.uploadedImages.length > 0 && !model.supportsVision) {
                    responseDiv.innerHTML = `<div class="error">Note: ${model.name} does not support image analysis. Only text will be processed.</div>`;
                }
            }

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'UNIVERSAL AI'
                },
                body: JSON.stringify({
                    model: model.id,
                    messages: [
                        {
                            role: 'user',
                            content: messageContent
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || 'No response generated';
            
            responseDiv.innerHTML = this.formatResponse(aiResponse);
            
        } catch (error) {
            console.error(`Error with ${model.name}:`, error);
            responseDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    formatResponse(text) {
        // Basic formatting for better readability
        return text
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    pickBestResponse(columnIndex, messageRow = null) {
        // Clear previous selection in this message row
        if (messageRow) {
            messageRow.querySelectorAll('.model-response').forEach(response => {
                response.classList.remove('best-response');
            });
            
            // Mark this response as best
            const responseContainer = messageRow.querySelector(`[data-column-index="${columnIndex}"]`);
            responseContainer.classList.add('best-response');
        } else {
            // Fallback for old interface
            this.clearBestResponse();
            const column = document.querySelector(`[data-column-index="${columnIndex}"]`);
            if (column) column.classList.add('best-response');
        }
        
        this.selectedBestResponse = columnIndex;
    }

    clearBestResponse() {
        // Remove best-response class from all responses
        document.querySelectorAll('.model-response').forEach(response => {
            response.classList.remove('best-response');
        });
        this.selectedBestResponse = null;
    }

    async copyResponse(columnIndex, messageRow = null) {
        let responseDiv;
        
        if (messageRow) {
            const responseContainer = messageRow.querySelector(`[data-column-index="${columnIndex}"]`);
            responseDiv = responseContainer.querySelector('.response-content');
        } else {
            responseDiv = document.getElementById(`response-${columnIndex}`);
        }
        
        const responseText = responseDiv.textContent || responseDiv.innerText;
        
        try {
            await navigator.clipboard.writeText(responseText);
            
            // Show feedback
            let copyBtn;
            if (messageRow) {
                const responseContainer = messageRow.querySelector(`[data-column-index="${columnIndex}"]`);
                copyBtn = responseContainer.querySelector('.copy-btn');
            } else {
                copyBtn = document.querySelector(`[data-column-index="${columnIndex}"] .copy-btn`);
            }
            
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '#2196F3';
                }, 2000);
            }
            
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy response. Please select and copy manually.');
        }
    }
}

// Initialize the application
const aiComparison = new AIModelComparison();
