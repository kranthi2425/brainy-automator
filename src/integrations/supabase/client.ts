// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iwthycobeztewwqwyzbq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dGh5Y29iZXp0ZXd3cXd5emJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDE2MjUsImV4cCI6MjA1MzkxNzYyNX0.eBjBgqaQrnC_1es2PnDI2a0CeEK_PJ1sjHsWuyr8zeQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);