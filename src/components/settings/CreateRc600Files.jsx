import { useSetListsFinalContext } from '../../contexts/SetListsFinalContext';
import { useRepertoireContext } from '../../contexts/RepertoireContext';
import { useSetListsContext } from '../../contexts/SetListsContext';
import { collectDataForRc600 } from '../../utils/setListHelpers';
import React, { useEffect, useState } from 'react';

function CreateRc600Files() {
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { setListsFinal } = useSetListsFinalContext();
  const [dataForRc600, setDataForRc600] = useState([]);

  useEffect(() => {
    setDataForRc600(collectDataForRc600(repertoire, setLists, setListsFinal));
  }, [repertoire, setLists, setListsFinal]);

  return (
    <button className="btn-red w-full py-2" onClick={() => console.log(dataForRc600)}>
      CREATE RC600 FILES
    </button>
  );
}

export default CreateRc600Files;
