const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

    hardSaveSetListsData: (data) =>
      ipcRenderer.invoke("hard-save-setlists-data", data),

    loadSetListsDataFromFile: () =>
      ipcRenderer.invoke("load-setlists-data-from-file"),

    setDataSaved: () => ipcRenderer.send("data-is-saved"),
  },
});
