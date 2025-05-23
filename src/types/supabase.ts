export type Database = {
  public: {
    Tables: {
      // Tutaj możesz dodać definicje swoich tabel
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          // inne pola
        };
        Insert: {
          id?: string;
          email: string;
          // inne pola
        };
        Update: {
          id?: string;
          email?: string;
          // inne pola
        };
      };
      // inne tabele
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
