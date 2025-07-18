import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="dark:bg-gray-900 bg-white p-6 rounded-lg max-w-md w-full border border-border shadow-xl animate-scaleIn">
        <h3 className="text-lg font-semibold mb-4">Potwierdź usunięcie</h3>
        <p className="mb-6 text-foreground/80">Czy na pewno chcesz usunąć to zamówienie? Tej akcji nie można cofnąć.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-destructive-foreground rounded border hover:bg-destructive/90 transition-colors cursor-pointer">
            Usuń
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors cursor-pointer">
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};
