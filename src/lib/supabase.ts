import { createClient } from '@supabase/supabase-js';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up Supabase.'
  );
}

// Create Supabase client with enhanced retry configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'college-consultancy-directory',
    },
  },
  db: {
    schema: 'public',
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Enhanced retry logic with exponential backoff and circuit breaker
const MAX_CONSECUTIVE_FAILURES = 3;
let consecutiveFailures = 0;
let circuitBreakerTimeout: NodeJS.Timeout | null = null;

// Enhanced retry logic with exponential backoff
export async function retryableQuery<T extends PostgrestResponse<any> | PostgrestSingleResponse<any>>(
  queryFn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  // Check circuit breaker
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    throw new Error('Service temporarily unavailable. Please try again later.');
  }

  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await queryFn();
      // Reset consecutive failures on success
      consecutiveFailures = 0;
      return result;
    } catch (error) {
      lastError = error;

      // Only retry on network errors or rate limit errors
      if (isRetryableError(error)) {
        // Increment consecutive failures
        consecutiveFailures++;

        // If we hit the threshold, activate circuit breaker
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          activateCircuitBreaker();
          throw new Error(
            'Service temporarily unavailable. Please try again later.'
          );
        }

        // Exponential backoff with jitter
        const delay = initialDelay * Math.pow(2, i) + Math.random() * 1000;
        console.log(
          `Retrying query attempt ${i + 1} after ${Math.round(delay)}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

// Helper function to check if error is retryable
function isRetryableError(error: any): boolean {
  // Network errors
  if (
    error instanceof Error &&
    (error.message === 'Failed to fetch' ||
      error.message.includes('NetworkError') ||
      error.message.includes('Network request failed'))
  ) {
    return true;
  }

  // Rate limit errors
  if (error?.code === '429' || error?.message?.includes('Too many requests')) {
    return true;
  }

  // Connection errors
  if (
    error?.message?.includes('connection') ||
    error?.message?.includes('timeout')
  ) {
    return true;
  }

  return false;
}

// Circuit breaker implementation
function activateCircuitBreaker() {
  // Clear any existing timeout
  if (circuitBreakerTimeout) {
    clearTimeout(circuitBreakerTimeout);
  }

  // Reset after 30 seconds
  circuitBreakerTimeout = setTimeout(() => {
    consecutiveFailures = 0;
    circuitBreakerTimeout = null;
  }, 30000);
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    return 'Service is temporarily unavailable. Please try again in a few minutes.';
  }

  if (isRetryableError(error)) {
    return 'Connection issue detected. Retrying...';
  }

  // Common Supabase error codes
  switch (error?.code) {
    case 'PGRST116':
      return 'No data found.';
    case '42703':
      return 'Invalid database query. Please try again later.';
    case '23505':
      return 'This record already exists.';
    case '23503':
      return 'This operation would break data relationships.';
    case '42501':
      return "You don't have permission to perform this action.";
    default:
      if (error?.message?.includes('JWT')) {
        return 'Your session has expired. Please log in again.';
      }
      return 'An unexpected error occurred. Please try again later.';
  }
}

// Helper to check connection status
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    // Test database connection
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('count')
      .limit(1);

    if (sessionsError) {
      console.error('Database connection error:', sessionsError);
      return false;
    }

    // Test realtime connection
    const channel = supabase.channel('test_connection');
    
    let isConnected = false;
    const subscription = channel
      .on('presence', { event: 'sync' }, () => {
        isConnected = true;
        channel.unsubscribe();
      })
      .subscribe();

    // Cleanup
    setTimeout(() => {
      subscription.unsubscribe();
    }, 1000);

    return isConnected;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}
