import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const supabaseUrl = "https://qflrqrenovaqljwmlohb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbHJxcmVub3ZhcWxqd21sb2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMjEzOTMsImV4cCI6MjA1NTg5NzM5M30.ksv9WFsgT5C6V27X_p8Ic7sNVP3CKtnOUDZlnN0wmE8";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
