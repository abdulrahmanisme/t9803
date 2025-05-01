import React from 'react';
import { useChatbot } from './ChatbotContext';

export function AskAssistantButton() {
  const { setIsOpen } = useChatbot();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
    >
      <span className="material-icons mr-2">smart_toy</span>
      Ask Our AI Assistant
    </button>
  );
} 