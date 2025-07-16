import React from "react";
import { UIOrder } from "@/types/UIOrder";

export const OrderRow = ({
  order,
  index,
  getStatusColor,
  formatDate,
  formatPrice,
  onShowDetails, // funkcja do wyświetlania szczegółów
}: {
  order: UIOrder;
  index: number;
  getStatusColor: (status: string) => string;
  formatDate: (dateString?: string) => string;
  formatPrice: (price: number) => string;
  onShowDetails: (order: UIOrder) => void;
}) => (
  <tr className={index % 2 === 0 ? "bg-card" : "bg-muted/5"}>
    <td className="px-4 py-4 whitespace-nowrap text-sm">{order.id || `#${index + 1}`}</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatDate(order.created_at)}</td>
    <td className="px-4 py-4 whitespace-nowrap">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm">
      {order.contact_info.first_name} {order.contact_info.last_name}
      <br />
      <span className="text-muted-foreground">{order.contact_info.phone || "-"}</span>
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm">
      {order.size.name}
      {order.additional_options.length > 0 && <span className="text-muted-foreground block">+ {order.additional_options.length} dodatki</span>}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm">{formatPrice(order.total_price)}</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm flex flex-col space-y-1">
      <button onClick={() => onShowDetails(order)} className="text-primary hover:text-primary/80 transition-colors">
        Szczegóły
      </button>

      <button className="text-red-500 hover:text-red-600 transition-colors">Usuń</button>
    </td>
  </tr>
);
