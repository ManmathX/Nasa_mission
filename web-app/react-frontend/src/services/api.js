// API service for Exoplanet LLM backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ExoplanetAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }

  // Chat with the LLM
  async chat(message, options = {}) {
    const {
      conversationId = null,
      temperature = 0.7,
      maxTokens = 512
    } = options;

    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        temperature,
        max_tokens: maxTokens
      })
    });
  }

  // Analyze exoplanet data
  async analyzeExoplanet(data) {
    return this.request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Get conversation history
  async getConversation(conversationId) {
    return this.request(`/api/conversations/${conversationId}`);
  }

  // Get model information
  async getModelInfo() {
    return this.request('/model/info');
  }

  // Get API documentation
  async getDocs() {
    return this.request('/docs');
  }

  // Check if API is available
  async isAvailable() {
    try {
      const health = await this.checkHealth();
      return health.model_loaded;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const api = new ExoplanetAPI();

export default api;
