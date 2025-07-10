import { ArrowUp, ArrowDown, ArrowUpDown, Funnel } from "lucide-react";
import { PortalDropdown } from "@/components/orders/PortalDropdown";
import React from "react";

export function TableHeaderCell({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
  isSortable = false,
  isFilterable = false,
  filterButtonRef,
  showDropdown,
  setShowDropdown,
  dropdownOptions = [],
  onFilter,
  filterValue,
  funnel = false,
}: {
  label: string;
  sortKey?: string;
  currentSortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: () => void;
  isSortable?: boolean;
  isFilterable?: boolean;
  filterButtonRef?: React.RefObject<HTMLButtonElement | null>;
  showDropdown?: boolean;
  setShowDropdown?: (open: boolean) => void;
  dropdownOptions?: string[];
  onFilter?: (value: string | null) => void;
  filterValue?: string | null;
  funnel?: boolean;
}) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
      <div className="flex items-center space-x-0.5">
        {isFilterable && filterButtonRef && setShowDropdown && (
          <div className="relative">
            <button
              ref={filterButtonRef}
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3 py-1 rounded-l border border-border bg-muted hover:bg-muted/80 text-sm flex items-center gap-1 uppercase cursor-pointer"
            >
              {funnel && <Funnel className="w-4 h-4" />}
              {filterValue ?? label}
            </button>
            <PortalDropdown
              anchorRef={filterButtonRef}
              open={!!showDropdown}
              onClose={() => setShowDropdown(false)}
            >
              {dropdownOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onFilter?.(option === "All" ? null : option);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-muted"
                  style={{ textTransform: "none" }}
                >
                  {option}
                </button>
              ))}
            </PortalDropdown>
          </div>
        )}
        {isSortable && onSort && (
          <button
            type="button"
            onClick={onSort}
            className="flex items-center gap-1 uppercase text-xs font-medium text-muted-foreground border border-border rounded px-2 py-1 hover:bg-muted/80 cursor-pointer"
          >
            {label}
            <span className="inline-block w-4 align-middle">
              {currentSortKey === sortKey ? (
                sortDirection === "asc" ? (
                  <ArrowUp className="w-4 h-4 inline" />
                ) : (
                  <ArrowDown className="w-4 h-4 inline" />
                )
              ) : (
                <ArrowUpDown className="w-4 h-4 inline" />
              )}
            </span>
          </button>
        )}
        {!isFilterable && !isSortable && <span>{label}</span>}
      </div>
    </th>
  );
}
