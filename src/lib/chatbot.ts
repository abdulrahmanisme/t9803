import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  text: string;
  created_at: string;
  session_id: string;
}

export interface ChatSession {
  id: string;
  created_at: string;
  user_id?: string;
}

export class ChatbotService {
  private static instance: ChatbotService;
  private currentSessionId: string | null = null;
  private genAI: GoogleGenerativeAI;
  private model: any;

  private constructor() {
    // Initialize Gemini with the provided API key
    this.genAI = new GoogleGenerativeAI('AIzaSyBewm2I3ALLKdw01kV_iJs2oUVt1dGJ7Po');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  public async initializeSession(): Promise<string> {
    if (this.currentSessionId) {
      return this.currentSessionId;
    }

    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({})
      .select()
      .single();

    if (sessionError) {
      throw new Error('Failed to create chat session');
    }

    this.currentSessionId = session.id;

    // Send welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now(),
      type: 'bot',
      text: "👋 Hi there! I'm your Overseas Education Guide. I can help you with:\n\n" +
        "• **University Selection**: Find the best universities for your field\n" +
        "• **Admission Process**: Step-by-step guidance for applications\n" +
        "• **Visa Requirements**: Country-specific visa information\n" +
        "• **Scholarships**: Available funding opportunities\n" +
        "• **Cost of Living**: Budget planning for different countries\n" +
        "• **Career Prospects**: Job opportunities after graduation\n\n" +
        "What would you like to know about studying abroad?",
      created_at: new Date().toISOString(),
      session_id: this.currentSessionId
    };

    // Store welcome message in Supabase
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert(welcomeMessage);

    if (messageError) {
      console.error('Failed to store welcome message:', messageError);
    }

    return session.id;
  }

  public async sendMessage(text: string): Promise<ChatMessage> {
    if (!this.currentSessionId) {
      await this.initializeSession();
    }

    // Store user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      text,
      created_at: new Date().toISOString(),
      session_id: this.currentSessionId
    };

    // Store user message in Supabase
    const { error: userError } = await supabase
      .from('chat_messages')
      .insert(userMessage);

    if (userError) {
      console.error('Failed to store user message:', userError);
    }

    // Generate bot response using Gemini
    const botResponse = await this.generateBotResponse(text);

    // Store bot response
    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'bot',
      text: botResponse,
      created_at: new Date().toISOString(),
      session_id: this.currentSessionId
    };

    // Store bot message in Supabase
    const { error: botError } = await supabase
      .from('chat_messages')
      .insert(botMessage);

    if (botError) {
      console.error('Failed to store bot message:', botError);
    }

    return botMessage;
  }

  private async generateBotResponse(userMessage: string): Promise<string> {
    const maxRetries = 3;
    const retryDelay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = `You are an expert Overseas Education Guide. Provide a concise response (2-3 sentences) to the student's question about studying abroad.

        The student asked: "${userMessage}"

        Guidelines for your response:
        1. Keep it brief and to the point
        2. Focus on the most important information
        3. Use **bold** for key points or deadlines
        4. If more details are needed, suggest what specific information to ask about

        Example format:
        "For [topic], the key points are: **point 1**, **point 2**. Would you like more details about any specific aspect?"`;

        const result = await this.model.generateContent({
          contents: [{
            parts: [{ text: prompt }]
          }]
        });

        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          console.error('All retry attempts failed:', error);
          return "I apologize, but I'm having trouble generating a response. Please try again later.";
        }
        
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }

    return "I apologize, but I'm having trouble generating a response. Please try again later.";
  }

  public async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch messages');
    }

    return messages;
  }

  public async subscribeToNewMessages(
    sessionId: string,
    callback: (message: ChatMessage) => void
  ) {
    return supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  public async deleteChatHistory(): Promise<void> {
    if (!this.currentSessionId) return;

    try {
      // Delete all messages for the current session
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', this.currentSessionId);

      if (messagesError) {
        console.error('Failed to delete messages:', messagesError);
      }

      // Delete the session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', this.currentSessionId);

      if (sessionError) {
        console.error('Failed to delete session:', sessionError);
      }

      // Reset the current session
      this.currentSessionId = null;
    } catch (error) {
      console.error('Error deleting chat history:', error);
    }
  }
} 