import React from "react";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: string;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, title, details }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-4 text-gray-700">{details}</p>
        <button
          className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ActivityModal;
