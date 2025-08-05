import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AnalyticsEvents } from "@/types/UIAnalyticsEvents";

export function useAnalytics() {
  const [events, setEvents] = useState<AnalyticsEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await supabase.from("analytics_events").select("*");

      if (error) {
        console.error("Supabase error:", error.message);
        setError(error.message);
      } else {
        setEvents(data as AnalyticsEvents[]);
      }

      setLoading(false);
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}
