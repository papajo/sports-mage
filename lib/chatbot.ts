'use client';

import { useState } from 'react';

// Types for chat messages
export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}

// Predefined responses for common sports queries
const PREDEFINED_RESPONSES: Record<string, string> = {
  'live scores': 'You can find live scores on the Live Scores page. Would you like me to take you there?',
  'football': 'We have comprehensive football data including leagues, teams, fixtures, and standings. Which league are you interested in?',
  'premier league': 'The Premier League section shows all teams, upcoming fixtures, and current standings. You can also view detailed statistics for each match.',
  'basketball': 'Our basketball section includes NBA, EuroLeague, and other major competitions. Would you like to see the latest NBA scores?',
  'subscription': 'We offer three subscription tiers: Free, Basic ($9.99/month), and Premium ($19.99/month). Each tier provides different levels of data access and features.',
  'payment': 'You can test our payment system using test credit cards. Would you like to see the available test cards?',
  'test cards': 'We have several test cards you can use: 4242 4242 4242 4242 (always approved), 4000 0000 0000 0002 (always declined), and more.',
  'help': 'I can help you find sports data, navigate the site, explain features, or assist with subscription information. What would you like to know?'
};

// AI chatbot hook
export function useSportsChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your sports data assistant. How can I help you find sports information today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Function to generate a simple response based on user input
  const generateResponse = (userInput: string): string => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Check for predefined responses
    for (const [key, response] of Object.entries(PREDEFINED_RESPONSES)) {
      if (lowercaseInput.includes(key)) {
        return response;
      }
    }
    
    // Check for specific sports
    if (lowercaseInput.includes('soccer') || lowercaseInput.includes('football')) {
      return 'We have data for many football leagues including Premier League, La Liga, Serie A, Bundesliga, and more. Which league would you like to explore?';
    }
    
    if (lowercaseInput.includes('basketball') || lowercaseInput.includes('nba')) {
      return 'Our basketball section includes NBA teams, games, and statistics. You can view live scores and standings.';
    }
    
    if (lowercaseInput.includes('baseball') || lowercaseInput.includes('mlb')) {
      return 'Our baseball section includes MLB teams, games, and statistics. You can track your favorite teams and get live updates.';
    }
    
    if (lowercaseInput.includes('hockey') || lowercaseInput.includes('nhl')) {
      return 'Our hockey section includes NHL teams, games, and statistics. You can view live scores and standings.';
    }
    
    // Search-related queries
    if (lowercaseInput.includes('search') || lowercaseInput.includes('find')) {
      return 'You can use the search bar at the top of the page to find teams, leagues, or matches. What are you looking for specifically?';
    }
    
    // Payment or subscription related
    if (lowercaseInput.includes('pay') || lowercaseInput.includes('subscribe') || lowercaseInput.includes('price')) {
      return 'We offer Free, Basic ($9.99/month), and Premium ($19.99/month) subscription plans. Would you like to see the features included in each plan?';
    }
    
    // Default response
    return 'I can help you find sports data, navigate the site, or answer questions about our features. Could you provide more details about what you\'re looking for?';
  };

  // Function to handle sending a message
  const sendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isTyping
  };
}

