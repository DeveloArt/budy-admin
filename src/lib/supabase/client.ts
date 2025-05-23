import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ulpyntcjljwcvewhaoso.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscHludGNqbGp3Y3Zld2hhb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjE2MjEsImV4cCI6MjA2Mjc5NzYyMX0.tx-jgl1Wx-CEwMGVBqiRnyLYQABJQPrpjqJsq3nTGqM";

// Sprawdzenie poprawności konfiguracji
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("BŁĄD: Brakujące zmienne środowiskowe dla Supabase!");
}

// Utwórz klienta Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
