import { useSelectedSetListContext } from '../../contexts/SelectedSetListContext';
import { useSetListsFinalContext } from '../../contexts/SetListsFinalContext';
import { useRepertoireContext } from '../../contexts/RepertoireContext';
import { useSetListsContext } from '../../contexts/SetListsContext';
import React from 'react';

function CreateRc600Files() {
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { setListsFinal } = useSetListsFinalContext();

  async function createXMLFile() {
    const result = await window.electron.ipcRenderer.createXMLFile();
    console.log(result.message);
  }

  return (
    <button className="btn-blue w-full py-2" onClick={createXMLFile}>
      CREATE RC600 FILES
    </button>
  );
}

export default CreateRc600Files;
