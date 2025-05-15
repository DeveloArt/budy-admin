# Budy Admin Panel

Panel administracyjny zbudowany z wykorzystaniem Next.js 15 (App Router) i Supabase.

## Funkcje

- Nowoczesny interfejs użytkownika z Tailwind CSS
- Autoryzacja i autentykacja użytkowników przez Supabase
- Panel administracyjny z różnymi widokami
- System routingu oparty na App Directory w Next.js
- Middleware dla ochrony tras
- Pełne wsparcie dla TypeScript

## Struktura projektu

```
src/
├── app/                    # Główny katalog App Router
│   ├── (auth)/             # Grupa routingu dla autoryzacji
│   │   ├── login/          # Strona logowania
│   │   ├── register/       # Strona rejestracji
│   │   ├── (dashboard)/    # Grupa routingu dla panelu admin
│   │   │   ├── users/      # Zarządzanie użytkownikami
│   │   │   ├── settings/   # Ustawienia
│   │   ├── api/            # Endpointy Route Handlers
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Strona główna
│   ├── components/         # Komponenty wielokrotnego użytku
│   │   ├── ui/             # Komponenty UI (przyciski, formularze)
│   │   ├── layout/         # Komponenty layoutu
│   ├── lib/                # Biblioteki i utility
│   │   ├── supabase/       # Klient Supabase
│   │   ├── types/          # Definicje TypeScript
│   │   ├── utils/          # Funkcje pomocnicze
│   ├── middleware.ts       # Middleware Next.js
```

## Konfiguracja środowiska

1. Stwórz plik `.env.local` bazując na `.env.local.example`
2. Uzupełnij klucze Supabase URL i anon key z Twojego projektu Supabase

## Uruchomienie projektu

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Budowanie projektu
npm run build

# Uruchomienie produkcyjne
npm start
```

## Licencja

MIT
