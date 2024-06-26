import React from 'react';
import { Button } from "@/components/ui/button";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
