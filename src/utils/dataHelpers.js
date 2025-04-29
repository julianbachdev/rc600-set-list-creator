export async function loadSetListsData(property, setContext) {
  try {
    const dataFromFile = await window.electron.ipcRenderer.loadSetListsDataFromFile();
    if (dataFromFile?.[property]) {
      setContext(dataFromFile[property]);
    } else {
      setContext([]);
    }
  } catch (error) {
    console.error(`Error loading ${property} data from file:`, error);
    setContext([]);
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function hardSaveSetListsData(data) {
  try {
    await window.electron.ipcRenderer.invoke('hard-save-setlists-data', data);
  } catch (error) {
    console.error('Error saving set lists data to local drive:', error);
  }
}

////////////////////////////////////////////////////////////////////////////////

export function openFolder(setRepertoire) {
  window.electron.ipcRenderer
    .invoke('open-folder')
    .then(files => {
      setRepertoire(files);
    })
    .catch(error => console.error('Error opening folder:', error));
}

////////////////////////////////////////////////////////////////////////////////

export function refreshFiles(setRepertoire) {
  window.electron.ipcRenderer
    .invoke('refresh-files')
    .then(files => {
      setRepertoire(files);
    })
    .catch(error => console.error('Error refreshing files:', error));
}

////////////////////////////////////////////////////////////////////////////////

export function createTextFiles(repertoire) {
  window.electron.ipcRenderer
    .invoke('create-text-files', repertoire)
    .then(result => {
      if (result && result.success) {
        console.log(result.message);
      } else {
        console.error(result?.message || 'Unknown error creating text files');
      }
    })
    .catch(error => console.error('Error creating text files:', error));
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

export async function createXMLFile(finalData) {
  if (finalData.length === 0) {
    window.alert('Please add set lists to final');
    return;
  }
  const result = await window.electron.ipcRenderer.createXMLFile();
  console.log(result.message);
}

////////////////////////////////////////////////////////////////////////////////

export async function createFolder() {
  const result = await window.electron.ipcRenderer.createFolder();
  console.log(result.message);
}
