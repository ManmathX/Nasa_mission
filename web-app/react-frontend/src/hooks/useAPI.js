import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Custom hook for API integration
export const useAPI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const isAvailable = await api.isAvailable();
      setIsConnected(isAvailable);
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  const sendMessage = useCallback(async (message, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.chat(message, options);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getModelInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const info = await api.getModelInfo();
      return info;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    checkConnection,
    sendMessage,
    getModelInfo
  };
};

// Hook for chat functionality
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const { isConnected, isLoading, error, sendMessage } = useAPI();

  const addMessage = useCallback((content, type, timestamp = new Date().toISOString()) => {
    const message = {
      id: Date.now() + Math.random(),
      content,
      type,
      timestamp
    };
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const sendChatMessage = useCallback(async (messageText, options = {}) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    addMessage(messageText, 'user');

    try {
      const response = await sendMessage(messageText, {
        conversationId,
        ...options
      });

      // Update conversation ID
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      // Add assistant response
      addMessage(response.response, 'assistant', response.timestamp);

      return response;
    } catch (err) {
      addMessage(
        `I apologize, but I'm experiencing technical difficulties. Please check if the API server is running and try again.\n\n**Error**: ${err.message}`,
        'assistant',
        new Date().toISOString()
      );
      throw err;
    }
  }, [isLoading, conversationId, sendMessage, addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (messages.length === 0) return;
    
    const lastUserMessage = messages
      .filter(msg => msg.type === 'user')
      .pop();
    
    if (lastUserMessage) {
      // Remove the last assistant message (error message)
      setMessages(prev => prev.slice(0, -1));
      
      try {
        await sendChatMessage(lastUserMessage.content);
      } catch (err) {
        console.error('Retry failed:', err);
      }
    }
  }, [messages, sendChatMessage]);

  return {
    messages,
    conversationId,
    isConnected,
    isLoading,
    error,
    sendChatMessage,
    clearMessages,
    retryLastMessage,
    addMessage
  };
};

// Hook for model information
export const useModelInfo = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const { isConnected, isLoading, error, getModelInfo } = useAPI();

  const fetchModelInfo = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const info = await getModelInfo();
      setModelInfo(info);
    } catch (err) {
      console.error('Failed to fetch model info:', err);
    }
  }, [isConnected, getModelInfo]);

  useEffect(() => {
    if (isConnected) {
      fetchModelInfo();
    }
  }, [isConnected, fetchModelInfo]);

  return {
    modelInfo,
    isConnected,
    isLoading,
    error,
    refetch: fetchModelInfo
  };
};
