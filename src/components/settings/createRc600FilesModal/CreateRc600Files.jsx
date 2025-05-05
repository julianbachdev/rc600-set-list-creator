import CreateRc600FilesModal from './Files.jsx';
import React, { useState } from 'react';

export default function Files() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateRC600Files() {
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <button className="btn-red w-full truncate py-2" onClick={handleCreateRC600Files}>
        CREATE RC600 FILES
      </button>
      <CreateRc600FilesModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
}
