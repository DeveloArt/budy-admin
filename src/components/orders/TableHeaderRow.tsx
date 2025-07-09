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

export function TableHeaderRow(props: TableHeaderRowProps) {
  return (
    <tr>
      <TableHeaderCell label="ID" />
      <TableHeaderCell
        label="DATA"
        sortKey="created_at"
        currentSortKey={props.sortKey}
        sortDirection={props.sortDirection}
        onSort={props.onSortDate}
        isSortable
      />
      <TableHeaderCell
        label="STATUS"
        isFilterable
        filterButtonRef={props.statusButtonRef}
        showDropdown={props.showStatusDropdown}
        setShowDropdown={props.setShowStatusDropdown}
        dropdownOptions={["All", ...props.allStatuses]}
        onFilter={props.onStatusFilter}
        filterValue={props.statusFilter}
        sortKey="status"
        currentSortKey={props.sortKey}
        sortDirection={props.statusSortDirection}
        onSort={props.onSortStatus}
        isSortable
        funnel
      />
      <TableHeaderCell label="KLIENT" />
      <TableHeaderCell
        label="PRODUKT"
        isFilterable
        filterButtonRef={props.productButtonRef}
        showDropdown={props.showProductDropdown}
        setShowDropdown={props.setShowProductDropdown}
        dropdownOptions={["All", ...props.allSizes]}
        onFilter={props.onProductFilter}
        filterValue={props.productFilter}
        sortKey="size"
        currentSortKey={props.sortKey}
        sortDirection={props.productSortDirection}
        onSort={props.onSortProduct}
        isSortable
        funnel
      />
      <TableHeaderCell
        label="CENA"
        sortKey="total_price"
        currentSortKey={props.sortKey}
        sortDirection={props.sortDirection}
        onSort={props.onSortPrice}
        isSortable
      />
      <TableHeaderCell label="AKCJE" />
    </tr>
  );
}
