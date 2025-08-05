"use client";
import React, { useState, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { TableHeaderCell } from "@/components/orders/TableHeaderCell";

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventNameFilter, setEventNameFilter] = useState<string | undefined>(undefined);

  const { events, loading, error } = useAnalytics();

  const [sortColumn, setSortColumn] = useState<"timestamp" | "event_name" | "session_id" | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showEventNameDropdown, setShowEventNameDropdown] = useState(false);

  function handleSort(column: "timestamp" | "event_name" | "session_id") {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const eventNameOptions = useMemo(() => {
    const uniqueNames = Array.from(new Set(events.map((e) => e.event_name))).sort();
    return ["Wszystkie", ...uniqueNames];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        event.page_url.toLowerCase().includes(searchTermLower) || event.session_id.includes(searchTerm) || event.additional_data?.target_url?.toLowerCase().includes(searchTermLower);

      const matchesEventNameFilter = eventNameFilter && eventNameFilter !== "Wszystkie" ? event.event_name === eventNameFilter : true;

      return matchesSearchTerm && matchesEventNameFilter;
    });

    if (sortColumn) {
      filtered = filtered.slice().sort((a, b) => {
        let valA: string | number = a[sortColumn];
        let valB: string | number = b[sortColumn];

        if (sortColumn === "timestamp") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [events, searchTerm, eventNameFilter, sortColumn, sortDirection]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zdarzenia Analityczne</h1>
        <div className="relative w-full max-w-md">
          <Input placeholder="Szukaj po URL, session_id lub targeted_url..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-8" />
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          {searchTerm && <X className="absolute right-2.5 top-3 h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setSearchTerm("")} />}
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">Błąd: {error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Brak zdarzeń</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted text-sm text-left text-muted-foreground">
              <tr>
                <TableHeaderCell label="Data" sortKey="timestamp" currentSortKey={sortColumn} sortDirection={sortDirection} onSort={() => handleSort("timestamp")} isSortable />
                <TableHeaderCell
                  label="Zdarzenie"
                  sortKey="event_name"
                  currentSortKey={sortColumn}
                  sortDirection={sortDirection}
                  onSort={() => handleSort("event_name")}
                  isSortable
                  isFilterable
                  filterButtonRef={filterButtonRef}
                  showDropdown={showEventNameDropdown}
                  setShowDropdown={setShowEventNameDropdown}
                  dropdownOptions={eventNameOptions}
                  onFilter={(val) => setEventNameFilter(val === "Wszystkie" ? undefined : val)}
                  filterValue={eventNameFilter}
                  funnel
                />
                <th className="p-3 w-[400px]">Strona</th>
                <TableHeaderCell label="Session ID" sortKey="session_id" currentSortKey={sortColumn} sortDirection={sortDirection} onSort={() => handleSort("session_id")} isSortable />
                <th className="p-3">Dodatkowe dane</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted text-sm">
              {filteredEvents.map((event, index) => (
                <tr key={event.id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                  <td className="p-3 whitespace-nowrap text-foreground">{new Date(event.timestamp).toLocaleString("pl-PL")}</td>
                  <td className="p-3">{event.event_name}</td>
                  <td className="p-3 text-blue-600 break-words max-w-[400px]">{event.page_url}</td>
                  <td className="p-3">{event.session_id}</td>
                  <td className="p-3 text-xs space-y-1 text-foreground">
                    {Object.entries(event.additional_data || {})
                      .filter(([_, value]) => value !== null && value !== "" && value !== undefined)
                      .map(([key, value]) => (
                        <div key={key}>
                          <strong>{key.replace(/_/g, " ")}:</strong> {value}
                        </div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
