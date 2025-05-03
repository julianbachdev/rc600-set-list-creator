import ElectronStore from 'electron-store';
import sanitize from 'sanitize-filename';
import { menuTemplate } from './menu';
console;
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

ipcMain.handle('open-files-from-folder', async () => {
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

ipcMain.handle('refresh-files-from-folder', async () => {
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

ipcMain.handle('save-setlists-data-to-file', async (event, data) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Set Lists Data',
      defaultPath:
        store.get('lastSetListsSavePath') ||
        path.join(app.getPath('home'), 'Desktop', 'rc600-SetListsData.json'),
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled) {
      return { success: false, message: 'Save operation cancelled' };
    }

    const dataWithTimestamp = {
      savedAt: new Date().toISOString(),
      setLists: data.setLists,
      setListsFinal: data.setListsFinal,
    };
    fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
    store.set('lastSetListsSavePath', filePath);
    dataSaved = true;
    console.log('Set lists data saved successfully to:', filePath);
    return { success: true, message: 'Set lists data saved successfully' };
  } catch (error) {
    console.error('Error saving set lists data:', error);
    return { success: false, message: `Error saving set lists data: ${error.message}` };
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('load-setlists-data-from-file', async (event, chooseFolder) => {
  try {
    let filePath;

    if (chooseFolder) {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Load Set Lists Data',
        defaultPath: store.get('lastSetListsSavePath') || app.getPath('home'),
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] },
        ],
        properties: ['openFile'],
      });

      if (canceled || !filePaths || filePaths.length === 0) {
        return { success: false, message: 'Load operation cancelled' };
      }

      filePath = filePaths[0];
      store.set('lastSetListsSavePath', filePath);
    } else {
      filePath = store.get('lastSetListsSavePath');
      if (!filePath) {
        return { success: false, message: 'No previous save location found' };
      }
    }

    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath);
      const data = JSON.parse(rawData);
      return { success: true, data };
    } else {
      return { success: false, message: 'File not found' };
    }
  } catch (error) {
    console.error('Error loading set lists data:', error);
    return { success: false, message: `Error loading set lists data: ${error.message}` };
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('save-setlists-data-to-store', async (event, data) => {
  try {
    const dataWithTimestamp = {
      savedAt: new Date().toISOString(),
      setLists: data.setLists,
      setListsFinal: data.setListsFinal,
    };
    store.set('setListsData', dataWithTimestamp);
    dataSaved = true;
    console.log('Set lists data saved successfully to store.');
  } catch (error) {
    console.error('Error saving set lists data to store:', error);
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('load-setlists-data-from-store', () => {
  try {
    return store.get('setListsData', {});
  } catch (error) {
    console.error('Error loading set lists data from store:', error);
    return {};
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
  dataSaved = false;
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('open-folder-dialog', async () => {
  if (!mainWindow) return { canceled: true, filePaths: [] };
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Destination Folder',
  });
  return result;
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('create-rc600-folder-structure', async (event, { basePath, folderName }) => {
  try {
    const mainFolder = path.join(basePath, folderName);

    // Check if folder already exists
    if (fs.existsSync(mainFolder)) {
      return { success: false, message: 'Folder name already exists' };
    }

    const waveFolder = path.join(mainFolder, 'WAVE');
    const dataFolder = path.join(mainFolder, 'DATA');

    // Create main folder
    await fs.promises.mkdir(mainFolder, { recursive: true });

    // Create WAVE and DATA folders
    await fs.promises.mkdir(waveFolder, { recursive: true });
    await fs.promises.mkdir(dataFolder, { recursive: true });

    // Create TEMP folder inside WAVE
    await fs.promises.mkdir(path.join(waveFolder, 'TEMP'), { recursive: true });

    // Create numbered folders (001_1 to 099_6)
    for (let i = 1; i <= 99; i++) {
      const prefix = i.toString().padStart(3, '0');
      for (let j = 1; j <= 6; j++) {
        const folderName = `${prefix}_${j}`;
        await fs.promises.mkdir(path.join(waveFolder, folderName), { recursive: true });
      }
    }

    return { success: true, message: 'RC600 folder structure created successfully' };
  } catch (error) {
    console.error('Error creating RC600 folder structure:', error);
    return { success: false, message: `Error creating folders: ${error.message}` };
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('populate-rc600-folders', async (event, { folderName, selectedPath, data }) => {
  const verificationResult = await verifyRc600FolderStructure(selectedPath, folderName);
  if (!verificationResult.success) {
    return verificationResult;
  }

  let xmlDataTemplateFolder;
  if (process.env.NODE_ENV === 'development') {
    xmlDataTemplateFolder = path.join(app.getAppPath(), 'src', 'data', 'xmlDataTemplate');
  } else {
    xmlDataTemplateFolder = process.resourcesPath;
  }

  const dataFolder = path.join(selectedPath, folderName, 'DATA');
  const waveFolder = path.join(selectedPath, folderName, 'WAVE');

  try {
    await handleCopyRhythmFile(xmlDataTemplateFolder, dataFolder);
    await handleCopySystemFiles(xmlDataTemplateFolder, dataFolder);
    await handleCopyMemoryFiles(xmlDataTemplateFolder, dataFolder, data);
  } catch (error) {
    throw new Error(`Failed to copy files: ${error.message}`);
  }

  return {
    success: true,
    message: 'Successfully copied all files to DATA folder',
  };
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

async function verifyRc600FolderStructure(basePath, folderName) {
  try {
    const mainFolder = path.join(basePath, folderName);
    const dataFolder = path.join(mainFolder, 'DATA');
    const waveFolder = path.join(mainFolder, 'WAVE');
    const tempFolder = path.join(waveFolder, 'TEMP');
    if (!fs.existsSync(mainFolder)) {
      throw new Error('Main folder does not exist');
    }
    if (!fs.existsSync(dataFolder)) {
      throw new Error('DATA folder does not exist');
    }
    if (!fs.existsSync(waveFolder)) {
      throw new Error('WAVE folder does not exist');
    }
    if (!fs.existsSync(tempFolder)) {
      throw new Error('TEMP folder does not exist inside WAVE folder');
    }
    for (let i = 1; i <= 99; i++) {
      const prefix = i.toString().padStart(3, '0');
      for (let j = 1; j <= 6; j++) {
        const numberedFolder = path.join(waveFolder, `${prefix}_${j}`);
        if (!fs.existsSync(numberedFolder)) {
          throw new Error(`Folder ${prefix}_${j} does not exist inside WAVE folder`);
        }
      }
    }
    return {
      success: true,
      message: 'RC600 folder structure verified successfully',
    };
  } catch (error) {
    console.error('Error verifying RC600 folder structure:', error);
    return {
      success: false,
      message: `Failed to verify folder structure: ${error.message}`,
    };
  }
}

////////////////////////////////////////////////////////////////////////////////

async function handleCopyRhythmFile(xmlDataTemplateFolder, dataFolder) {
  const rhythmSource = path.join(xmlDataTemplateFolder, 'RHYTHM.RC0');
  const rhythmDest = path.join(dataFolder, 'RHYTHM.RCO');
  try {
    await fs.promises.copyFile(rhythmSource, rhythmDest);
  } catch (error) {
    throw new Error(`Failed to copy RHYTHM.RCO: ${error.message}`);
  }
}

////////////////////////////////////////////////////////////////////////////////

async function handleCopySystemFiles(xmlDataTemplateFolder, dataFolder) {
  const systemSource = path.join(xmlDataTemplateFolder, 'SYSTEM1.RC0');
  const system1Dest = path.join(dataFolder, 'SYSTEM1.RCO');

  try {
    await fs.promises.copyFile(systemSource, system1Dest);
  } catch (error) {
    throw new Error(`Failed to copy SYSTEM1.RCO: ${error.message}`);
  }

  const system2Dest = path.join(dataFolder, 'SYSTEM2.RCO');
  const tempDest = path.join(dataFolder, 'SYSTEM2.tmp');

  try {
    const content = await fs.promises.readFile(systemSource, 'utf-8');
    const modifiedContent = content.replace(/<count>0001<\/count>/, '<count>0002</count>');
    await fs.promises.writeFile(tempDest, modifiedContent, 'utf-8');
    await fs.promises.rename(tempDest, system2Dest);
  } catch (error) {
    try {
      await fs.promises.unlink(tempDest).catch(() => {});
    } catch (cleanupError) {
      console.error('Failed to clean up temporary file:', cleanupError);
    }
    throw new Error(`Failed to create SYSTEM2.RCO: ${error.message}`);
  }
}

////////////////////////////////////////////////////////////////////////////////

async function handleCopyMemoryFiles(xmlDataTemplateFolder, dataFolder, data) {
  const memorySource = path.join(xmlDataTemplateFolder, 'MEMORY001A.RC0');
  let dataIndex = 0;

  try {
    for (let mem = 1; mem <= 99; mem++) {
      const memoryNumber = mem.toString().padStart(3, '0');

      const memoryDestA = path.join(dataFolder, `MEMORY${memoryNumber}A.RCO`);
      const tempDestA = path.join(dataFolder, `MEMORY${memoryNumber}A.tmp`);
      const memoryDestB = path.join(dataFolder, `MEMORY${memoryNumber}B.RCO`);
      const tempDestB = path.join(dataFolder, `MEMORY${memoryNumber}B.tmp`);

      try {
        if (dataIndex < data.length) {
          const currentData = data[dataIndex];
          dataIndex++;

          // Read and modify XML for both versions
          const content = await fs.promises.readFile(memorySource, 'utf-8');
          const modifiedContentA = await modifyMemoryXml(content, currentData, 'A', mem);
          const modifiedContentB = await modifyMemoryXml(content, currentData, 'B', mem);

          // Write modified content to both A and B versions
          await fs.promises.writeFile(tempDestA, modifiedContentA, 'utf-8');
          await fs.promises.rename(tempDestA, memoryDestA);
          await fs.promises.writeFile(tempDestB, modifiedContentB, 'utf-8');
          await fs.promises.rename(tempDestB, memoryDestB);
        } else {
          // No more data, use template directly
          await fs.promises.copyFile(memorySource, tempDestA);
          await fs.promises.rename(tempDestA, memoryDestA);

          await fs.promises.copyFile(memorySource, tempDestB);
          await fs.promises.rename(tempDestB, memoryDestB);
        }
      } catch (error) {
        try {
          await fs.promises.unlink(tempDestA).catch(() => {});
          await fs.promises.unlink(tempDestB).catch(() => {});
        } catch (cleanupError) {
          console.error(
            `Failed to clean up temporary files for MEMORY${memoryNumber}:`,
            cleanupError
          );
        }
        throw new Error(
          `Failed to create memory files for MEMORY${memoryNumber}: ${error.message}`
        );
      }
    }
  } catch (error) {
    throw new Error(`Failed to process memory files: ${error.message}`);
  }
}

////////////////////////////////////////////////////////////////////////////////

async function modifyMemoryXml(content, currentData, version, mem) {
  let modifiedContent = content;

  // Modify count based on version
  const countValue = version === 'A' ? '0001' : '0002';
  modifiedContent = modifiedContent.replace(/<count>\d+<\/count>/g, `<count>${countValue}</count>`);

  // Update the three tags with zero-based memory number
  modifiedContent = modifiedContent.replace(/<mem id="\d+">/g, `<mem id="${mem - 1}">`);
  modifiedContent = modifiedContent.replace(/<ifx id="\d+">/g, `<ifx id="${mem - 1}">`);
  modifiedContent = modifiedContent.replace(/<tfx id="\d+">/g, `<tfx id="${mem - 1}">`);

  // Modify NAME (ASCII values)
  const nameLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  currentData.name.rc600Value.forEach((asciiValue, index) => {
    modifiedContent = modifiedContent.replace(
      new RegExp(
        `<NAME>[\\s\\S]*?<${nameLetters[index]}>\\d+</${nameLetters[index]}>[\\s\\S]*?</NAME>`,
        'g'
      ),
      match =>
        match.replace(
          new RegExp(`<${nameLetters[index]}>\\d+</${nameLetters[index]}>`),
          `<${nameLetters[index]}>${asciiValue}</${nameLetters[index]}>`
        )
    );
  });

  // Modify BPM in all TRACKS and MASTER
  const tracks = ['TRACK1', 'TRACK2', 'TRACK3', 'TRACK4', 'TRACK5', 'TRACK6'];
  tracks.forEach(track => {
    modifiedContent = modifiedContent.replace(
      new RegExp(`<${track}>[\\s\\S]*?<U>\\d+</U>[\\s\\S]*?</${track}>`, 'g'),
      match => match.replace(/<U>\d+<\/U>/, `<U>${currentData.bpm.rc600Value}</U>`)
    );
  });
  modifiedContent = modifiedContent.replace(
    /<MASTER>[\s\S]*?<A>\d+<\/A>[\s\S]*?<\/MASTER>/g,
    match => match.replace(/<A>\d+<\/A>/, `<A>${currentData.bpm.rc600Value}</A>`)
  );

  // Modify samplesPerMeasure in all TRACKS and MASTER
  tracks.forEach(track => {
    modifiedContent = modifiedContent.replace(
      new RegExp(`<${track}>[\\s\\S]*?<V>\\d+</V>[\\s\\S]*?</${track}>`, 'g'),
      match => match.replace(/<V>\d+<\/V>/, `<V>${currentData.samplesPerMeasure.rc600Value}</V>`)
    );
  });
  modifiedContent = modifiedContent.replace(
    /<MASTER>[\s\S]*?<B>\d+<\/B>[\s\S]*?<\/MASTER>/g,
    match => match.replace(/<B>\d+<\/B>/, `<B>${currentData.samplesPerMeasure.rc600Value}</B>`)
  );

  // Modify RHYTHM settings
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<A>\d+<\/A>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<A>\d+<\/A>/, `<A>${currentData.genre.rc600Value}</A>`)
  );
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<B>\d+<\/B>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<B>\d+<\/B>/, `<B>${currentData.pattern.rc600Value}</B>`)
  );
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<C>\d+<\/C>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<C>\d+<\/C>/, `<C>${currentData.variation.rc600Value}</C>`)
  );
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<E>\d+<\/E>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<E>\d+<\/E>/, `<E>${currentData.kit.rc600Value}</E>`)
  );
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<F>\d+<\/F>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<F>\d+<\/F>/, `<F>${currentData.timeSignature.rc600Value}</F>`)
  );
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<M>\d+<\/M>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<M>\d+<\/M>/, `<M>${currentData.rhythmOnOff.rc600Value}</M>`)
  );

  // Modify KEY in all TRACKS
  modifiedContent = modifiedContent.replace(
    /<AB_HARMONIST_MANUAL>[\s\S]*?<D>\d+<\/D>[\s\S]*?<\/AB_HARMONIST_MANUAL>/g,
    match => match.replace(/<D>\d+<\/D>/, `<D>${currentData.keyTrue.rc600Value}</D>`)
  );

  return modifiedContent;
}
