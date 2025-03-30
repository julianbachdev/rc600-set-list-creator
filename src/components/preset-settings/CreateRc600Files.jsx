import { useSelectedSetListContext } from '../../contexts/SelectedSetListContext';
import { useSetListsFinalContext } from '../../contexts/SetListsFinalContext';
import { useRepertoireContext } from '../../contexts/RepertoireContext';
import { useSetListsContext } from '../../contexts/SetListsContext';
import { bpmMeasureLengths } from '../../data/settingsData.js';
import React from 'react';

function CreateRc600Files() {
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { setListsFinal } = useSetListsFinalContext();

  return (
    <button
      className="btn-blue w-full py-2"
      onClick={() => {
        console.log('repertoire', repertoire);
        console.log('setLists', setLists);
        console.log('selectedSetList', selectedSetList);
        console.log('setListsFinal', setListsFinal);
      }}
    >
      CREATE RC600 FILES
    </button>
  );
}

export default CreateRc600Files;
