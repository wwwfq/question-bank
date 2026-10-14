import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://gpjjmmdqyxvhdxkwmayh.supabase.co';
export const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamptbWRxeXh2aGR4a3dtYXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NjcwOTYsImV4cCI6MjEwNzU0MzA5Nn0.6pkVIsrfrXeAYSEQqYLAdXpKBvpu-yQQLXHrYUXF1Dk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
