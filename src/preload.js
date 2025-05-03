const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    openFilesFromFolder: () => ipcRenderer.invoke('open-files-from-folder'),
    refreshFilesFromFolder: () => ipcRenderer.invoke('refresh-files-from-folder'),
    saveSetListsDataToFile: data => ipcRenderer.invoke('save-setlists-data-to-file', data),
    loadSetListsDataFromFile: (chooseFolder = false) =>
      ipcRenderer.invoke('load-setlists-data-from-file', chooseFolder),

    overwriteTextFile: (song, options = { overwrite: false }) =>
      ipcRenderer.invoke('overwrite-text-file', song, options),
    createRc600FolderStructure: (basePath, folderName) =>
      ipcRenderer.invoke('create-rc600-folder-structure', { basePath, folderName }),
    populateRc600Folders: (folderName, selectedPath, data) =>
      ipcRenderer.invoke('populate-rc600-folders', { folderName, selectedPath, data }),
    setDataSaved: () => ipcRenderer.send('data-is-saved'),
  },
});
