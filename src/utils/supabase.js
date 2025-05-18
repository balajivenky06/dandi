import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Log the first few characters of the key for debugging (safely)
const keyPreview = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10);
console.log('Initializing Supabase client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key preview:', keyPreview + '...');

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'dandi-dashboard'
      }
    }
  }
);

// Test the connection with detailed error logging
const testConnection = async () => {
  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }

    console.log('Supabase connection test successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', {
      message: err.message,
      stack: err.stack
    });
    return false;
  }
};

// Run the connection test and retry if needed
const initializeConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const success = await testConnection();
    if (success) {
      return;
    }
    if (i < retries - 1) {
      console.log(`Connection test failed, retrying... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Initialize connection
initializeConnection(); 