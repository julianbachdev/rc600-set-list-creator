import { hardSaveSetListsData, openFolder, refreshFiles } from '../utils/dataHelpers.js';
import { useRepertoireContext } from '../contexts/RepertoireContext.js';
import React, { useEffect } from 'react';

function SettingsHeader() {
  return (
    <div className="header-container">
      <div className="header-container-label">
        <div>SETTINGS</div>
      </div>
    </div>
  );
}

export default SettingsHeader;
