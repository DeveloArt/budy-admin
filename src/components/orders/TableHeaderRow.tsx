import React from "react";
import { TableHeaderCell } from "./TableHeaderCell";

interface TableHeaderRowProps {
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSortDate: () => void;
  statusButtonRef: React.RefObject<HTMLButtonElement | null>;
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  allStatuses: string[];
  onStatusFilter: (value: string | null) => void;
  statusFilter: string | null;
  statusSortDirection: "asc" | "desc";
  onSortStatus: () => void;
  productButtonRef: React.RefObject<HTMLButtonElement | null>;
  showProductDropdown: boolean;
  setShowProductDropdown: (show: boolean) => void;
  allSizes: string[];
  onProductFilter: (value: string | null) => void;
  productFilter: string | null;
  productSortDirection: "asc" | "desc";
  onSortProduct: () => void;
  onSortPrice: () => void;
}

export function TableHeaderRow({
  sortKey,
  sortDirection,
  onSortDate,
  statusButtonRef,
  showStatusDropdown,
  setShowStatusDropdown,
  allStatuses,
  onStatusFilter,
  statusFilter,
  statusSortDirection,
  onSortStatus,
  productButtonRef,
  showProductDropdown,
  setShowProductDropdown,
  allSizes,
  onProductFilter,
  productFilter,
  productSortDirection,
  onSortProduct,
  onSortPrice,
}: TableHeaderRowProps) {
  return (
    <tr>
      <TableHeaderCell label="ID" />
      <TableHeaderCell label="DATA" sortKey="created_at" currentSortKey={sortKey} sortDirection={sortDirection} onSort={onSortDate} isSortable />
      <TableHeaderCell
        label="STATUS"
        isFilterable
        filterButtonRef={statusButtonRef}
        showDropdown={showStatusDropdown}
        setShowDropdown={setShowStatusDropdown}
        dropdownOptions={["Wszystkie", ...allStatuses]}
        onFilter={onStatusFilter}
        filterValue={statusFilter}
        sortKey="status"
        currentSortKey={sortKey}
        sortDirection={statusSortDirection}
        onSort={onSortStatus}
        isSortable
        funnel
      />
      <TableHeaderCell label="KLIENT" />
      <TableHeaderCell
        label="PRODUKT"
        isFilterable
        filterButtonRef={productButtonRef}
        showDropdown={showProductDropdown}
        setShowDropdown={setShowProductDropdown}
        dropdownOptions={["Wszystkie", ...allSizes]}
        onFilter={onProductFilter}
        filterValue={productFilter}
        sortKey="size"
        currentSortKey={sortKey}
        sortDirection={productSortDirection}
        onSort={onSortProduct}
        isSortable
        funnel
      />
      <TableHeaderCell label="CENA" sortKey="total_price" currentSortKey={sortKey} sortDirection={sortDirection} onSort={onSortPrice} isSortable />
      <TableHeaderCell label="AKCJE" />
    </tr>
  );
}
