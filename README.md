# UNIVERSAL AI

A web application that allows you to compare responses from multiple AI models simultaneously using OpenRouter API.

## Features

- **Multi-Model Comparison**: Compare responses from 2-6 AI models side by side
- **Universal Input**: Send the same message to all selected models at once
- **Model Selection**: Choose from popular models including GPT-4, Claude, Gemini, DeepSeek, Perplexity, and more
- **Best Response Selection**: Pick and highlight the best response
- **Copy Functionality**: Easily copy any model's response
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Loading**: See responses as they generate with loading indicators

## Supported AI Models

- GPT-4o & GPT-4o Mini
- Claude 3.5 Sonnet & Claude 3 Haiku
- Gemini Pro 1.5
- DeepSeek Chat
- Perplexity Sonar
- Llama 3.1 (8B & 70B)
- Mistral Large

## Setup Instructions

### 1. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Go to your API Keys section
4. Generate a new API key
5. Copy the API key for use in the application

### 2. Run the Application

1. Open `index.html` in your web browser
2. Enter your OpenRouter API key in the designated field
3. Select the number of models you want to compare (2-6)
4. Choose different AI models for each column
5. Type your message and press Enter or click "Send to All Models"

### 3. Using the Tool

1. **Enter API Key**: Your key is stored locally and never sent to external servers
2. **Select Models**: Choose different models for each column to compare their responses
3. **Send Message**: Type your question/prompt and hit Enter to send to all models
4. **Compare Responses**: View responses side by side as they generate
5. **Pick Best**: Click "Pick Best" on your preferred response to highlight it
6. **Copy Response**: Use the "Copy" button to copy any response to clipboard

## File Structure

```
ai-model-comparison/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Security Notes

- Your OpenRouter API key is stored locally in your browser's localStorage
- The key is never transmitted to any server except OpenRouter's official API
- Clear your browser data to remove the stored API key

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design supported

## Troubleshooting

### Common Issues

1. **"Please enter your OpenRouter API key"**
   - Make sure you've entered a valid OpenRouter API key
   - Check that the key hasn't expired

2. **"Error: HTTP 401"**
   - Your API key is invalid or expired
   - Generate a new key from OpenRouter

3. **"Error: HTTP 429"**
   - You've hit rate limits
   - Wait a moment before sending another request

4. **No response generated**
   - The model may be temporarily unavailable
   - Try a different model or wait and retry

### Performance Tips

- Use fewer models (2-3) for faster responses
- Shorter prompts generally get faster responses
- Some models are faster than others (e.g., GPT-4o Mini vs GPT-4o)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
