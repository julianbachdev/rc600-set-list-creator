import { useSetListsFinalContext } from '../../contexts/SetListsFinalContext';
import { useRepertoireContext } from '../../contexts/RepertoireContext';
import { useSetListsContext } from '../../contexts/SetListsContext';
import { collectDataForRc600 } from '../../utils/setListHelpers';
import React from 'react';

function CreateRc600Files() {
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { setListsFinal } = useSetListsFinalContext();

  function handleCreateRC600Files() {
    console.log(collectDataForRc600(repertoire, setLists, setListsFinal));
  }

  return (
    <button className="btn-red w-full truncate py-2" onClick={handleCreateRC600Files}>
      CREATE RC600 FILES
    </button>
  );
}

export default CreateRc600Files;
