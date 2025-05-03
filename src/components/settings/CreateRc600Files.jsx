import CreateRc600FilesModal from './CreateRc600FilesModal.jsx';
import React, { useState } from 'react';

function CreateRc600Files() {
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

export default CreateRc600Files;
