import ElectronStore from 'electron-store';
import sanitize from 'sanitize-filename';
import { menuTemplate } from './menu';

const { app, BrowserWindow, shell, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const store = new ElectronStore();
let dataSaved = true;

if (require('electron-squirrel-startup')) {
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
    return { action: 'deny' };
  });
  mainWindow.on('close', e => {
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

ipcMain.handle('refresh-files', async () => {
  let folderPath = store.get('folderPath');
  if (!folderPath) {
    if (!mainWindow) return [];
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) return [];
    folderPath = result.filePaths[0];
    store.set('folderPath', folderPath);
  }

  const filesWithContent = await Promise.all(
    fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.txt'))
      .map(async file => {
        const filePath = path.join(folderPath, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return {
          name: file,
          path: filePath,
          content: content,
        };
      })
  );

  return filesWithContent;
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('open-folder', async () => {
  if (!mainWindow) return [];
  let folderPath = store.get('folderPath');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    folderPath = result.filePaths[0];
  }
  store.set('folderPath', folderPath);

  const filesWithContent = await Promise.all(
    fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.txt'))
      .map(async file => {
        const filePath = path.join(folderPath, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return {
          name: file,
          path: filePath,
          content: content,
        };
      })
  );
  return filesWithContent;
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('hard-save-setlists-data', async (event, data) => {
  try {
    const desktopPath = path.join(app.getPath('home'), 'Desktop');
    const filePath = path.join(desktopPath, 'rc600-SetListsData.json');

    const dataWithTimestamp = {
      savedAt: new Date().toISOString(),
      setLists: data.setLists,
      setListsFinal: data.setListsFinal,
    };

    fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
    dataSaved = true;
    console.log('Set lists data saved successfully to local drive.');
  } catch (error) {
    console.error('Error saving set lists data to local drive:', error);
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('load-setlists-data-from-file', () => {
  try {
    const desktopPath = path.join(app.getPath('home'), 'Desktop');
    const filePath = path.join(desktopPath, 'rc600-SetListsData.json');
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);
      return data;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error loading set lists data from file:', error);
    return {};
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('create-xml-file', async () => {
  try {
    const desktopPath = path.join(app.getPath('home'), 'Desktop');
    const filePath = path.join(desktopPath, 'default.xml');

    const defaultXMLContent = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item>
    <name>Example Item</name>
    <value>123</value>
  </item>
</root>`;

    fs.writeFileSync(filePath, defaultXMLContent, 'utf-8');
    console.log('XML file created successfully on the desktop.');
    return { success: true, message: 'XML file created successfully.' };
  } catch (error) {
    console.error('Error creating XML file:', error);
    return { success: false, message: 'Failed to create XML file.' };
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('create-text-files', async (event, repertoire) => {
  try {
    if (!mainWindow) return { success: false, message: 'Window not available' };
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Folder to Save Text Files',
    });
    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, message: 'No folder selected' };
    }

    const selectedFolder = result.filePaths[0];
    const createdFiles = [];

    for (const item of repertoire) {
      const cleanName = sanitize(item.name.trim().replace(/\.txt$/i, ''));
      if (!cleanName) {
        return {
          success: false,
          message: 'Invalid or empty item name after sanitizing',
        };
      }

      const filePath = path.join(selectedFolder, `${cleanName}.txt`);

      try {
        await fs.promises.writeFile(filePath, item.content, 'utf-8');
        createdFiles.push(cleanName);
      } catch (writeError) {
        return {
          success: false,
          message: `Failed to write file ${cleanName}: ${writeError.message}`,
        };
      }
    }

    return {
      success: true,
      message: `Successfully created ${createdFiles.length} text files`,
      files: createdFiles,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create text files: ${error.message}`,
    };
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('overwrite-text-file', async (event, song, overwrite = false) => {
  try {
    if (!song || !song.name || !song.content || !song.path || !song.settings) {
      return { success: false, message: 'Invalid song object' };
    }

    let filteredContent = song.content
      .split('\n')
      .filter(line => !line.trim().startsWith('#'))
      .join('\n')
      .trimEnd();
    const settingsLines = Object.entries(song.settings).map(([key, value]) => `# ${key}: ${value}`);
    const finalContent = `${filteredContent}\n\n${settingsLines.join('\n')}`;
    let filePath;
    const cleanName = sanitize(song.name.trim().replace(/\.txt$/i, ''));

    if (!cleanName) {
      return { success: false, message: 'Invalid or empty song name after sanitizing' };
    }

    let candidateName = `${cleanName}.txt`;

    if (overwrite) {
      const originalPath = song.path;
      const targetFolder = path.dirname(originalPath);
      filePath = path.join(targetFolder, candidateName);
      if (filePath !== originalPath && fs.existsSync(originalPath)) {
        await fs.promises.unlink(originalPath);
      }
    } else {
      if (!mainWindow) return { success: false, message: 'Window not available' };
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Select Folder to Save the Text File',
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, message: 'No folder selected' };
      }

      const selectedFolder = result.filePaths[0];
      filePath = path.join(selectedFolder, candidateName);

      let counter = 1;
      while (fs.existsSync(filePath)) {
        candidateName = `${cleanName}(${counter}).txt`;
        filePath = path.join(selectedFolder, candidateName);
        counter++;
      }
    }

    await fs.promises.writeFile(filePath, finalContent, 'utf-8');

    return {
      success: true,
      message: `File saved as ${path.basename(filePath)}`,
      filePath,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to save song: ${error.message}`,
    };
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.on('data-is-saved', () => {
  console.log('Data-is-saved flag set to false');
  dataSaved = false;
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// APP ON HANDLERS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.on('ready', createWindow);

app.whenReady().then(() => {
  const setListsData = store.get('setListsData', []);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('load-setlists-data', setListsData); // Send data to renderer
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', e => {
  e.preventDefault();
});

app.on('before-quit', handleAppExit);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CUSTOM FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function handleAppExit(e) {
  e.preventDefault();
  if (!dataSaved) {
    const response = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Quit Without Saving', 'Cancel'],
      defaultId: 0,
      title: 'Save Data Before Exit',
      message: 'Do you want to save your set lists before exiting?',
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
