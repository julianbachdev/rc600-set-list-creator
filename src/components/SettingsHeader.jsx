import { hardSaveSetListsData, openFolder, refreshFiles } from '../utils/dataHelpers.js';
import { useSetListsFinalContext } from '../contexts/SetListsFinalContext.js';
import { useRepertoireContext } from '../contexts/RepertoireContext.js';
import { useSetListsContext } from '../contexts/SetListsContext.js';
import React, { useEffect } from 'react';

function SettingsHeader() {
  const { repertoire, handleSetRepertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { setListsFinal } = useSetListsFinalContext();

  function handleHardSaveSetListsData() {
    const data = {
      setLists: setLists,
      setListsFinal: setListsFinal,
    };
    hardSaveSetListsData(data);
  }

  useEffect(() => {
    refreshFiles(handleSetRepertoire);
  }, []);

  return (
    <div className="header-container">
      <div className="header-container-label">
        <div>SETTINGS</div>
        <button className="btn-blue" onClick={handleHardSaveSetListsData}>
          SAVE
        </button>
      </div>
      <div className="header-container-label pb-1">
        <div>RC600 SONGS</div>
        <button onClick={() => refreshFiles(handleSetRepertoire)} className="btn-blue">
          Refresh
        </button>
        <button onClick={() => openFolder(handleSetRepertoire)} className="btn-blue">
          Load
        </button>
      </div>
    </div>
  );
}

export default SettingsHeader;
