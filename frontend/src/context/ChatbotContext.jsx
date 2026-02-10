import React, { createContext, useState, useCallback } from 'react';

export const ChatbotContext = createContext();

export const ChatbotContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  return (
    <ChatbotContext.Provider value={{ messages, addMessage, isChatOpen, toggleChat }}>
      {children}
    </ChatbotContext.Provider>
  );
};