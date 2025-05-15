import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Endpoint logowania użytkownika
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Logowanie za pomocą emaila i hasła
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Błąd logowania:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Zwracamy informacje o sesji
    return NextResponse.json(
      {
        user: data.user,
        session: data.session,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "Nieoczekiwany błąd:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Błąd podczas autoryzacji" },
      { status: 500 }
    );
  }
}

// Endpoint wylogowania użytkownika
export async function DELETE() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error(
      "Błąd wylogowania:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Błąd podczas wylogowania" },
      { status: 500 }
    );
  }
}
