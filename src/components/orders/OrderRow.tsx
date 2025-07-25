import React, { useState } from "react";
import { UIOrder } from "@/types/UIOrder";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { StatusChangeModal } from "./StatusChangeConfirmation";
import { ChevronDown } from "lucide-react";

export const OrderRow = ({
  order,
  index,
  getStatusColor,
  formatDate,
  formatPrice,
  onShowDetails,
  onDeleteOrder,
}: {
  order: UIOrder;
  index: number;
  getStatusColor: (status: string) => string;
  formatDate: (dateString?: string) => string;
  formatPrice: (price: number) => string;
  onShowDetails: (order: UIOrder) => void;
  onDeleteOrder: () => void;
}) => {
  const { updateStatus } = useUpdateOrderStatus();

  const [localStatus, setLocalStatus] = useState(order.status);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus !== localStatus) {
      setPendingStatus(newStatus);
      setIsModalOpen(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    const { error } = await updateStatus(order.id, pendingStatus);
    if (error) {
      alert("Błąd przy zmianie statusu: " + error.message);
      setPendingStatus(null);
      setIsModalOpen(false);
      return;
    }

    setLocalStatus(pendingStatus);
    setPendingStatus(null);
    setIsModalOpen(false);

    window.location.reload();
  };

  return (
    <>
      <StatusChangeModal
        isOpen={isModalOpen}
        orderId={order.id}
        onClose={() => {
          setIsModalOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmStatusChange}
      />

      <tr className={index % 2 === 0 ? "bg-card" : "bg-muted/5"}>
        <td className="px-4 py-4 whitespace-nowrap">
          <code>{order.id || `#${index + 1}`}</code>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">{formatDate(order.created_at)}</td>
        <td className="px-4 py-4">
          <div className="relative">
            <select
              value={pendingStatus ?? localStatus}
              onChange={handleStatusChange}
              className={`
        appearance-none
        w-full
        py-2
        pl-3
        pr-8                    
        rounded-md
        focus:outline-none
        cursor-pointer
        border
        ${getStatusColor(pendingStatus ?? localStatus)}
      `}
            >
              {["pending", "processing", "completed", "cancelled"].map((status) => (
                <option key={status} value={status} className="bg-white text-black">
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown size={20} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 drop-shadow" />
          </div>
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          {order.contact_info.first_name} {order.contact_info.last_name}
          <br />
          <span className="text-muted-foreground">{order.contact_info.phone || "-"}</span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          {order.size.name}
          {order.additional_options.length > 0 && <span className="text-muted-foreground block">+ {order.additional_options.length} dodatki</span>}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">{formatPrice(order.total_price)}</td>
        <td className="px-4 py-4 whitespace-nowrap flex flex-row space-y-1">
          <button onClick={() => onShowDetails(order)} className="text-primary hover:text-primary/80 transition-colors border px-2 py-2 mb-0 me-1 cursor-pointer">
            Szczegóły
          </button>
          <button onClick={onDeleteOrder} className="text-red-500 hover:text-red-600 transition-colors border px-2 py-2 ms-1 cursor-pointer">
            Usuń
          </button>
        </td>
      </tr>
    </>
  );
};
