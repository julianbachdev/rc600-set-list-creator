export async function loadSetListsData(property, setContext) {
  try {
    const dataFromFile =
      await window.electron.ipcRenderer.loadSetListsDataFromFile();

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

export async function hardSaveSetListsData(data) {
  try {
    await window.electron.ipcRenderer.invoke("hard-save-setlists-data", data);
  } catch (error) {
    console.error("Error saving set lists data to local drive:", error);
  }
}
