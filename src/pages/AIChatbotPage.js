import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithClaudeAI } from '../api/simpleClaudeAI';
import './AIChatbotPage.css';

const AIChatbotPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Show welcome message
    const welcomeMsg = {
      role: 'assistant',
      content: "👋 Hello! I'm Claude, your AI assistant. I'm here to help you with any question you might have.\n\n🧠 I can assist with:\n• Science, technology, and research\n• History, culture, and current events\n• Literature, arts, and philosophy\n• Mathematics and problem-solving\n• Health and wellness (general info)\n• Business and economics\n• Travel planning and MapMates features\n• And much more!\n\nWhat would you like to explore today?",
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Get AI response
    setIsLoading(true);
    try {
      // Pass conversation history for context
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const aiResponse = await chatWithClaudeAI(userMessage, conversationHistory);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again, and I\'ll do my best to help you with any question you have.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chatbot-page">
      <div className="ai-chatbot-header">
        <button 
          className="ai-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <div className="ai-header-text">
          <h1>Claude AI Assistant</h1>
          <p>Ask me anything - I'm here to help with any question!</p>
        </div>
      </div>

      <div className="ai-messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`ai-message-bubble ${message.role}`}>
            <div className="ai-message-content">
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message-bubble assistant">
            <div className="ai-message-content">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-form" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className="ai-chat-input"
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ai-chat-send-btn"
          disabled={isLoading || !inputValue.trim()}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default AIChatbotPage;
