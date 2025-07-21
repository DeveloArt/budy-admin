import React from "react";

interface StatusChangeModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

export const StatusChangeModal = ({ isOpen, onClose, onConfirm, orderId }: StatusChangeModal) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="dark:bg-gray-900 bg-white p-6 rounded-lg max-w-md w-full border border-border shadow-xl animate-scaleIn">
        <h3 className="text-lg font-semibold mb-4">Potwierdź zmianę statusu</h3>
        <p className="mb-6 text-foreground/80">
          Czy na pewno chcesz zmienić status zamówienia <strong>{orderId}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-destructive-foreground rounded border hover:bg-destructive/90 transition-colors cursor-pointer">
            Zmień status
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors cursor-pointer">
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};
