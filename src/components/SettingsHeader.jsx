import { useSetListsFinalContext } from '../contexts/SetListsFinalContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import { loadSetListsDataFromFile } from '../utils/dataHelpers';
import React, { useEffect } from 'react';

function SettingsHeader() {
  const { setSetLists } = useSetListsContext();
  const { setSetListsFinal } = useSetListsFinalContext();

  function handleLoadSetLists() {
    console.log('loading set lists data from file');
    loadSetListsDataFromFile(true, 'setLists', setSetLists, 'setListsFinal', setSetListsFinal);
  }

  useEffect(() => {
    console.log('loading set lists data from effect');
    loadSetListsDataFromFile(false, 'setLists', setSetLists, 'setListsFinal', setSetListsFinal);
  }, []);

  return (
    <div className="header-container">
      <div className="header-container-label">
        <div className="header-container-text">SETTINGS</div>
        <button className="btn-blue truncate px-3" onClick={handleLoadSetLists}>
          Load Set Lists
        </button>
      </div>
    </div>
  );
}

export default SettingsHeader;
