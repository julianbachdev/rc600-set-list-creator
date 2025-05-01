import { useSetListsFinalContext } from '../../contexts/SetListsFinalContext';
import CreateRc600FilesModal from './CreateRc600FilesModal.jsx';
import React, { useState } from 'react';

function CreateRc600Files() {
  const { setListsFinal } = useSetListsFinalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateRC600Files() {
    if (setListsFinal.length === 0) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
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
