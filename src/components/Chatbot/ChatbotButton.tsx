import { useState, useEffect } from "react";
import { MessageSquare, X } from 'lucide-react';
import { useChatbot } from './ChatbotContext';

export function ChatbotButton() {
  const { isOpen, setIsOpen } = useChatbot();
  const [pulseEffect, setPulseEffect] = useState(false);

  // Trigger pulse animation periodically
  useEffect(() => {
    // Start pulsing 3 seconds after component mounts
    const timeoutId = setTimeout(() => {
      setPulseEffect(true);
      
      // Stop pulsing after 4 pulses
      const intervalId = setInterval(() => {
        setPulseEffect(prevState => {
          if (!prevState) {
            // If we turned it off, clear the interval
            clearInterval(intervalId);
          }
          return !prevState;
        });
      }, 2000);
      
      // Clear interval after some time if user hasn't interacted
      setTimeout(() => {
        clearInterval(intervalId);
        setPulseEffect(false);
      }, 10000);
      
    }, 3000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Reset pulse effect when chatbot is opened
  useEffect(() => {
    if (isOpen) {
      setPulseEffect(false);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Animated button with shadow and gradient */}
      <div className={`${pulseEffect ? 'animate-ping opacity-70' : 'opacity-0'} absolute inset-0 rounded-full bg-primary transition-opacity duration-300`}></div>
      
      <button
        id="chatbotButton"
        className="relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center focus:outline-none transition-all duration-300 transform hover:scale-105"
        aria-label="Open Chatbot"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
          </>
        )}
      </button>
      
      {/* Floating label */}
      {!isOpen && (
        <div className="absolute -top-10 right-0 bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ask admission questions
        </div>
      )}
    </div>
  );
} 