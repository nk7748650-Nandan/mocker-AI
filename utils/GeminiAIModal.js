// To run this code you need to install the following dependencies:
// npm install @google/genai mime

import { GoogleGenAI } from '@google/genai';

class GeminiAIModal {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({
      apiKey: apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
  }

  async generateContent(prompt, options = {}, fileData = null) {
    try {
      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        ...options
      };

      const model = 'gemini-flash-latest';

      const parts = [{ text: prompt }];

      if (fileData) {
        parts.push({
          inlineData: {
            mimeType: fileData.mimeType,
            data: fileData.data
          }
        });
      }

      const contents = [
        {
          role: 'user',
          parts: parts,
        },
      ];

      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = '';
      for await (const chunk of response) {
        if (chunk.text) {
          console.log(chunk.text);
          fullResponse += chunk.text;
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

}


// Example usage function
async function main() {
  try {
    const gemini = new GeminiAIModal('AIzaSyDoEmcJVlSnVvOCZ0lOtX-gBl0xBX2nYCA');

    console.log('🤖 Testing Gemini AI Integration...\n');

    // Test simple text generation
    const response = await gemini.generateContent('Explain JavaScript closures in simple terms.');
    console.log('\nResponse:', response);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export the class as default
export default GeminiAIModal;

// Named export for chat session functionality
export class ChatSession {
  constructor(apiKey) {
    this.gemini = new GeminiAIModal(apiKey);
    this.messages = [];
  }

  // Add a message to the conversation
  addMessage(role, content) {
    this.messages.push({
      role: role,
      parts: [{ text: content }]
    });
  }

  // Send a user message and get AI response
  async sendMessage(userMessage, fileData = null, options = {}) {
    try {
      // Add user message to conversation
      this.addMessage('user', userMessage);

      // Get AI response
      const response = await this.gemini.generateContent(userMessage, options, fileData);

      // Add AI response to conversation
      this.addMessage('model', response);

      return response;
    } catch (error) {
      console.error('Error in chat session:', error);
      throw error;
    }
  }

  // Get conversation history
  getHistory() {
    return this.messages;
  }

  // Clear conversation history
  clearHistory() {
    this.messages = [];
  }

  // Get last message
  getLastMessage() {
    return this.messages[this.messages.length - 1];
  }

  // Get conversation as formatted string
  getFormattedHistory() {
    return this.messages.map(msg =>
      `${msg.role.toUpperCase()}: ${msg.parts[0].text}`
    ).join('\n\n');
  }

  // Export conversation to JSON
  exportToJSON() {
    return JSON.stringify({
      messages: this.messages,
      timestamp: new Date().toISOString(),
      messageCount: this.messages.length
    }, null, 2);
  }

  // Import conversation from JSON
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.messages = data.messages || [];
      return true;
    } catch (error) {
      console.error('Error importing conversation:', error);
      return false;
    }
  }
}