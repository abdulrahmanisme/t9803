import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { useChatbot } from './ChatbotContext';
import { ChatbotService, ChatMessage } from '../../lib/chatbot';
import { testSupabaseConnection } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function Chatbot() {
  const { isOpen, setIsOpen } = useChatbot();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([
    "Visa requirements",
    "Top universities",
    "Scholarships",
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotService = ChatbotService.getInstance();

  useEffect(() => {
    if (isOpen) {
      checkConnectionAndInitialize();
    }
  }, [isOpen]);

  const checkConnectionAndInitialize = async () => {
    try {
      await initializeChat();
    } catch (error) {
      console.error('Connection check error:', error);
      toast.error('Failed to initialize chat service');
    }
  };

  const initializeChat = async () => {
    try {
      const sessionId = await chatbotService.initializeSession();
      const initialMessages = await chatbotService.getMessages(sessionId);
      setMessages(initialMessages);

      // Subscribe to new messages
      chatbotService.subscribeToNewMessages(sessionId, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });
    } catch (error) {
      console.error('Chat initialization error:', error);
      if (error.message === 'Unable to connect to chat service') {
        toast.error('Unable to connect to the chat service. Please try again later.');
      } else {
        toast.error('Failed to initialize chat');
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      
      // Create and add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        type: 'user',
        text: inputMessage,
        created_at: new Date().toISOString(),
        session_id: chatbotService.currentSessionId || ''
      };
      
      // Add user message to state immediately
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input
      setInputMessage("");
      
      // Get bot response
      const botMessage = await chatbotService.sendMessage(inputMessage);
      
      // Add bot message to state
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Message sending error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQueryClick = (query: string) => {
    setInputMessage(query);
  };

  const handleClose = async () => {
    try {
      await chatbotService.deleteChatHistory();
      setMessages([]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error closing chatbot:', error);
    }
  };

  const formatMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <span key={index} className="font-bold">{boldText}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 transition-all duration-300 transform ${
        isOpen
          ? "translate-y-0 opacity-100 visible"
          : "translate-y-10 opacity-0 invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-3 rounded-t-xl flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-1 mr-2">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Admissions Assistant</h3>
            <p className="text-[10px] text-white/80">Powered by AI</p>
          </div>
        </div>
        <button
          className="bg-white/20 hover:bg-white/30 rounded-full p-1 text-white transition-colors duration-200 focus:outline-none"
          aria-label="Close Chatbot"
          onClick={handleClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area with pattern background */}
      <div 
        className="h-64 overflow-y-auto p-3 bg-gradient-to-br from-gray-50 to-white" 
        id="chatMessages"
        style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, #f0f4ff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f4ff 2%, transparent 0%)",
          backgroundSize: "100px 100px"
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
              message.type === "user" ? "justify-end mb-3" : "mb-3"
            }`}
          >
            {message.type === "bot" && (
              <div className="bg-primary rounded-full p-1 mr-2 self-end mb-1">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`rounded-xl shadow-sm p-2 max-w-[85%] ${
                message.type === "user"
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white rounded-tr-none"
                  : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
                {formatMessageText(message.text)}
              </p>
            </div>
            {message.type === "user" && (
              <div className="bg-gray-200 rounded-full p-1 ml-2 self-end mb-1">
                <User className="w-3 h-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start mb-3">
            <div className="bg-primary rounded-full p-1 mr-2 self-end mb-1">
              <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-xl rounded-tl-none shadow-sm p-2">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with enhanced styling */}
      <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl">
        <div className="flex shadow-sm rounded-full border border-gray-200 overflow-hidden">
          <input
            type="text"
            placeholder="Type your question..."
            className="flex-grow px-4 py-2 border-none focus:outline-none focus:ring-0 text-gray-700 bg-transparent text-sm"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className={`px-3 flex items-center justify-center transition-colors duration-200 ${
              isLoading 
                ? "bg-gray-200 cursor-not-allowed" 
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Enhanced suggested queries */}
        {suggestedQueries.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-[10px] px-2 py-1 rounded-full border border-gray-200 text-gray-700 transition-all duration-200 shadow-sm hover:shadow"
                onClick={() => handleSuggestedQueryClick(query)}
              >
                {query}
              </button>
            ))}
          </div>
        )}
        
        {/* Help text */}
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          Ask me anything about universities, visa requirements, scholarships, or application processes!
        </p>
      </div>
    </div>
  );
} 