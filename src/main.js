import { menuTemplate } from "./menu";
import ElectronStore from "electron-store";

const {
  app,
  BrowserWindow,
  shell,
  Menu,
  dialog,
  ipcMain,
} = require("electron");
const fs = require("fs");
const path = require("path");
const store = new ElectronStore();
let dataSaved = true;

if (require("electron-squirrel-startup")) {
  app.quit();
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CREATE WINDOW
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      devTools: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.on("close", (e) => {
    handleAppExit(e);
  });
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CREATE CUSTOM MENU
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// IPC MAIN HANDLERS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

ipcMain.handle("refresh-files", async () => {
  let folderPath = store.get("folderPath");
  if (!folderPath) {
    if (!mainWindow) return [];
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) return [];
    folderPath = result.filePaths[0];
    store.set("folderPath", folderPath);
  }
  const files = fs.readdirSync(folderPath).map((file) => ({
    name: file,
    path: path.join(folderPath, file),
  }));
  return files;
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle("open-folder", async () => {
  if (!mainWindow) return [];
  let folderPath = store.get("folderPath");
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  if (!result.canceled || !result.filePaths.length === 0) {
    folderPath = result.filePaths[0];
  }
  store.set("folderPath", folderPath);
  const files = fs.readdirSync(folderPath).map((file) => ({
    name: file,
    path: path.join(folderPath, file),
  }));
  return files;
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle("hard-save-setlists-data", async (event, data) => {
  try {
    const desktopPath = path.join(app.getPath("home"), "Desktop");
    const filePath = path.join(desktopPath, "rc600-SetListsData.json");

    const dataWithTimestamp = {
      savedAt: new Date().toISOString(),
      setLists: data.setLists,
      setListsFinal: data.setListsFinal,
    };

    fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
    dataSaved = true;
    console.log("Set lists data saved successfully to local drive.");
  } catch (error) {
    console.error("Error saving set lists data to local drive:", error);
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle("load-setlists-data-from-file", () => {
  try {
    const desktopPath = path.join(app.getPath("home"), "Desktop");
    const filePath = path.join(desktopPath, "rc600-SetListsData.json");
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);
      return data;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error loading set lists data from file:", error);
    return {};
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.on("data-is-saved", () => {
  console.log("Data-is-saved flag set to false");
  dataSaved = false;
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// APP ON HANDLERS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.on("ready", createWindow);

app.whenReady().then(() => {
  const setListsData = store.get("setListsData", []);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("load-setlists-data", setListsData); // Send data to renderer
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", (e) => {
  e.preventDefault();
});

app.on("before-quit", handleAppExit);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CUSTOM FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function handleAppExit(e) {
  e.preventDefault();
  if (!dataSaved) {
    const response = dialog.showMessageBoxSync({
      type: "question",
      buttons: ["Quit Without Saving", "Cancel"],
      defaultId: 0,
      title: "Save Data Before Exit",
      message: "Do you want to save your set lists before exiting?",
    });
    if (response === 0) {
      app.exit();
    }
  } else {
    app.exit();
  }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
