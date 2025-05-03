export async function loadSetListsDataFromFile(
  chooseFolder,
  property1,
  setContext1,
  property2,
  setContext2
) {
  try {
    const result = await window.electron.ipcRenderer.loadSetListsDataFromFile(chooseFolder);
    if (result.success && result.data?.[property1] && result.data?.[property2]) {
      setContext1(result.data[property1]);
      setContext2(result.data[property2]);
    } else {
      console.error(result.message || 'Error loading data');
      setContext1([]);
      setContext2([]);
    }
  } catch (error) {
    console.error(`Error loading ${property1} and ${property2} data from file:`, error);
    setContext1([]);
    setContext2([]);
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function saveSetListsDataToFile(data) {
  try {
    await window.electron.ipcRenderer.invoke('save-setlists-data-to-file', data);
  } catch (error) {
    console.error('Error saving set lists data to local drive:', error);
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function openFilesFromFolder(setRepertoire) {
  window.electron.ipcRenderer
    .invoke('open-files-from-folder')
    .then(files => {
      setRepertoire(files);
    })
    .catch(error => console.error('Error opening folder:', error));
}

export async function openFilesFromFolderWithDialog(setRepertoire) {
  const [path, error] = await selectPath();
  if (error) {
    console.error('Error selecting path:', error);
    return;
  }

  window.electron.ipcRenderer
    .invoke('open-files-from-folder', path)
    .then(files => {
      setRepertoire(files);
    })
    .catch(error => console.error('Error opening folder:', error));
}

////////////////////////////////////////////////////////////////////////////////

export function refreshFilesFromFolder(setRepertoire) {
  window.electron.ipcRenderer
    .invoke('refresh-files-from-folder')
    .then(files => {
      setRepertoire(files);
    })
    .catch(error => console.error('Error refreshing files:', error));
}

////////////////////////////////////////////////////////////////////////////////

export function overWriteTextFile(song, overwrite) {
  const confirmed = window.confirm(
    overwrite
      ? "You're about to overwrite the original file"
      : "You're about to create a new version of your file"
  );
  if (!confirmed || !song.name) return;

  window.electron.ipcRenderer
    .invoke('overwrite-text-file', song, overwrite)
    .then(result => {
      if (result && result.success) {
        console.log(result.message);
      } else {
        console.error(result?.message || 'Unknown error saving song file');
      }
    })
    .catch(error => console.error('Error saving song file:', error));
}

////////////////////////////////////////////////////////////////////////////////

export async function createFolder() {
  const result = await window.electron.ipcRenderer.createFolder();
  console.log(result.message);
}

////////////////////////////////////////////////////////////////////////////////

export async function selectPath() {
  try {
    const result = await window.electron.ipcRenderer.invoke('open-folder-dialog');
    if (result && result.filePaths && result.filePaths.length > 0) {
      return [result.filePaths[0], ''];
    }
    return ['', ''];
  } catch (err) {
    return ['', 'Error selecting folder path'];
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function createRc600FolderStructure(basePath, folderName) {
  try {
    const result = await window.electron.ipcRenderer.invoke('create-rc600-folder-structure', {
      basePath,
      folderName,
    });
    if (result.success) {
      return [true, ''];
    } else {
      return [false, result.message];
    }
  } catch (error) {
    return [false, `Error creating RC600 folder structure: ${error.message}`];
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function populateRc600Folders(folderName, selectedPath, data) {
  const result = await window.electron.ipcRenderer.invoke('populate-rc600-folders', {
    folderName,
    selectedPath,
    data,
  });
  if (result.success) {
    return [true, ''];
  } else {
    return [false, result.message];
  }
}
