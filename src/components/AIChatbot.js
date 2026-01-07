import React, { useState, useEffect, useRef } from 'react';
import { chatWithClaudeAI } from '../api/simpleClaudeAI';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
      const conversationHistory = messages.map(msg => ({
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
    <div className="ai-chatbot-widget">
      <button 
        className="ai-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Assistant"
      >
        💬
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div>
              <h2 className="ai-chat-title">Claude AI Assistant</h2>
              <p className="ai-chat-subtitle">Ask me anything!</p>
            </div>
            <button 
              className="ai-chat-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="ai-messages-container">
            {messages.length === 0 ? (
              <div className="ai-empty-state">
                <div className="ai-empty-state-icon">🤖</div>
                <p className="ai-empty-state-text">
                  Hi! I'm Claude, your AI assistant. I can help with any question - from travel planning to science, history, technology, and more!
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          <form className="ai-chat-form" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              className="ai-chat-input"
              placeholder="Ask me anything - I'm here to help with any question!"
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
      )}
    </div>
  );
};

export default AIChatbot;
