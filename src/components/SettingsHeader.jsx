import React, { useEffect } from "react";
import { useRepertoireContext } from "../contexts/RepertoireContext.js";
import { extractTxtFiles } from "../utils/utilityHelpers.js";

function SettingsHeader() {
  const { setRepertoire } = useRepertoireContext();

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
        <button className="btn-blue">Show Details</button>
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
