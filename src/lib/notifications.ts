import { supabase } from './supabase';

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  template: 'review_approved' | 'review_rejected' | 'new_agency' | 'agency_approved';
  data: Record<string, any>;
}

export async function sendEmailNotification(notification: EmailNotification) {
  try {
    const { error } = await supabase.functions.invoke('send-notification', {
      body: notification
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}