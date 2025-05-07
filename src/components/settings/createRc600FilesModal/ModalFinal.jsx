import React from 'react';

export default function ModalFinal({ operationStatus, error, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex w-96 flex-col items-center rounded-lg bg-white p-6">
        <div className="mb-6 text-center text-lg font-semibold">
          {operationStatus === 'success'
            ? 'RC600 files were successfully created!'
            : `Failed to create RC600 files: ${error}`}
        </div>
        <button
          onClick={onClose}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
