import { ArrowUp, ArrowDown, ArrowUpDown, Funnel } from "lucide-react";
import { PortalDropdown } from "@/components/orders/PortalDropdown";
import React from "react";

type TableHeaderCellProps = {
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
};

type HeaderButtonProps = {
  label: string;
  onClick: () => void;
  variant: "sort" | "filter";
  icon?: React.ReactNode;
  active?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
};

function HeaderButton({ label, onClick, variant, icon, buttonRef }: HeaderButtonProps) {
  const baseClasses = "text-xs font-medium uppercase border border-border px-2 py-1 cursor-pointer hover:bg-muted/80";

  const variantClasses = variant === "sort" ? "text-muted-foreground rounded flex items-center gap-1" : "text-sm rounded-l bg-muted flex items-center gap-1";

  return (
    <button ref={buttonRef} type="button" onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {icon}
      {label}
    </button>
  );
}

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
}: TableHeaderCellProps) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
      <div className="flex flex-col items-start space-y-1">
        {isFilterable && filterButtonRef && setShowDropdown && (
          <div className="relative">
            <HeaderButton
              variant="filter"
              label={filterValue ?? label}
              onClick={() => setShowDropdown(!showDropdown)}
              icon={funnel ? <Funnel className="w-4 h-4" /> : null}
              buttonRef={filterButtonRef}
            />
            <PortalDropdown anchorRef={filterButtonRef} open={!!showDropdown} onClose={() => setShowDropdown(false)}>
              {dropdownOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onFilter?.(option === "Wszystkie" ? null : option);
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
          <HeaderButton
            variant="sort"
            label={label}
            onClick={onSort}
            icon={
              <span className="inline-block w-4 align-middle">
                {currentSortKey === sortKey ? sortDirection === "asc" ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" /> : <ArrowUpDown className="w-4 h-4 inline" />}
              </span>
            }
          />
        )}
        {!isFilterable && !isSortable && <span>{label}</span>}
      </div>
    </th>
  );
}
