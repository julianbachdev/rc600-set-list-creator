import React, { useEffect } from "react";
import { useRepertoireContext } from "../contexts/RepertoireContext.js";
import { extractTxtFiles } from "../utils/utilityHelpers.js";
import { hardSaveSetListsData } from "../utils/dataHelpers.js";
import { useSetListsFinalContext } from "../contexts/SetListsFinalContext.js";
import { useSetListsContext } from "../contexts/SetListsContext.js";

function SettingsHeader() {
  const { setRepertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { setListsFinal } = useSetListsFinalContext();

  function handleHardSaveSetListsData() {
    const data = {
      setLists: setLists,
      setListsFinal: setListsFinal,
    };
    hardSaveSetListsData(data);
  }

  function handleRefreshFiles() {
    window.electron.ipcRenderer
      .invoke("refresh-files")
      .then((files) => {
        const extractedTxtFiles = extractTxtFiles(files);
        setRepertoire(extractedTxtFiles);
      })
      .catch((error) => console.error("Error refreshing files:", error));
  }

  function handleOpenFolder() {
    window.electron.ipcRenderer
      .invoke("open-folder")
      .then((files) => {
        const extractedTxtFiles = extractTxtFiles(files);
        setRepertoire(extractedTxtFiles);
      })
      .catch((error) => console.error("Error opening folder:", error));
  }

  useEffect(() => {
    handleRefreshFiles();
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
        <button onClick={handleRefreshFiles} className="btn-blue">
          Refresh
        </button>
        <button onClick={handleOpenFolder} className="btn-blue">
          Load
        </button>
      </div>
    </div>
  );
}

export default SettingsHeader;
