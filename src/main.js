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
    icon: path.join(__dirname, 'assets', 'icons', 'icon.png'),
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
  const filesWithContent = await getTxtFilesWithContent(folderPath);
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
  const filesWithContent = await getTxtFilesWithContent(folderPath);
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
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('create-rc600-folder-structure', async (event, { basePath, folderName }) => {
  try {
    const mainFolder = path.join(basePath, folderName);
    // Check if folder already exists
    if (fs.existsSync(mainFolder)) {
      return [false, 'Folder name already exists'];
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
    // Verify the entire structure was created correctly
    const verificationResult = await verifyRc600FolderStructure(basePath, folderName);
    if (!verificationResult[0]) {
      return verificationResult;
    }
    return [true, null];
  } catch (error) {
    console.error('Error creating RC600 folder structure:', error);
    return [false, `Error creating folders: ${error.message}`];
  }
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('populate-rc600-folders', async (event, { folderName, selectedPath, data }) => {
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
  } catch (error) {
    return [false, `Failed to copy rhythm file: ${error.message}`];
  }

  try {
    await handleCopySystemFiles(xmlDataTemplateFolder, dataFolder);
  } catch (error) {
    return [false, `Failed to copy system files: ${error.message}`];
  }

  try {
    await handleCopyMemoryFiles(xmlDataTemplateFolder, dataFolder, data);
  } catch (error) {
    return [false, `Failed to copy memory files: ${error.message}`];
  }

  try {
    await handleCopyWaveFiles(xmlDataTemplateFolder, waveFolder, data);
  } catch (error) {
    return [false, `Failed to copy wave files: ${error.message}`];
  }

  return [true, null];
});

////////////////////////////////////////////////////////////////////////////////

ipcMain.handle('delete-rc600-folder-structure', async (event, { basePath, folderName }) => {
  try {
    const mainFolder = path.join(basePath, folderName);

    // Check if folder exists
    if (!fs.existsSync(mainFolder)) {
      return [false, 'Folder does not exist'];
    }

    // Delete the entire folder structure recursively
    await fs.promises.rm(mainFolder, { recursive: true, force: true });

    // Verify the folder was deleted
    if (fs.existsSync(mainFolder)) {
      return [false, 'Failed to delete folder structure'];
    }

    return [true, null];
  } catch (error) {
    console.error('Error deleting RC600 folder structure:', error);
    return [false, `Error deleting folder structure: ${error.message}`];
  }
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// CUSTOM FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function handleAppExit(e) {
  if (e && e.preventDefault) e.preventDefault();
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
      return [false, 'Main folder does not exist'];
    }
    if (!fs.existsSync(dataFolder)) {
      return [false, 'DATA folder does not exist'];
    }
    if (!fs.existsSync(waveFolder)) {
      return [false, 'WAVE folder does not exist'];
    }
    if (!fs.existsSync(tempFolder)) {
      return [false, 'TEMP folder does not exist inside WAVE folder'];
    }
    for (let i = 1; i <= 99; i++) {
      const prefix = i.toString().padStart(3, '0');
      for (let j = 1; j <= 6; j++) {
        const numberedFolder = path.join(waveFolder, `${prefix}_${j}`);
        if (!fs.existsSync(numberedFolder)) {
          return [false, `Folder ${prefix}_${j} does not exist inside WAVE folder`];
        }
      }
    }
    return [true, null];
  } catch (error) {
    console.error('Error verifying RC600 folder structure:', error);
    return [false, `Failed to verify folder structure: ${error.message}`];
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
  const memory0_0Source = path.join(xmlDataTemplateFolder, '0_0', '000000000A.RC0');
  const memory2_4Source = path.join(xmlDataTemplateFolder, '2_4', '222222222A.RC0');
  const memory3_4Source = path.join(xmlDataTemplateFolder, '3_4', '333333333A.RC0');
  const memory4_4Source = path.join(xmlDataTemplateFolder, '4_4', '444444444A.RC0');
  const memory5_8Source = path.join(xmlDataTemplateFolder, '5_8', '555555555A.RC0');
  const memory7_8Source = path.join(xmlDataTemplateFolder, '7_8', '777777777A.RC0');
  const memory9_8Source = path.join(xmlDataTemplateFolder, '9_8', '999999999A.RC0');

  const memorySources = [
    memory0_0Source,
    memory2_4Source,
    memory3_4Source,
    memory4_4Source,
    memory5_8Source,
    memory7_8Source,
    memory9_8Source,
  ];

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

          const timeSignature = currentData.timeSignature.value;
          const rhythmOnOff = currentData.rhythm.value;
          const timeSignatureMap = {
            '2/4': 1,
            '3/4': 2,
            '4/4': 3,
            '5/8': 4,
            '7/8': 5,
            '9/8': 6,
          };
          const sourceIndex = timeSignatureMap[timeSignature] || 0;
          let memorySource;

          if (rhythmOnOff === 'ON') {
            memorySource = memorySources[sourceIndex];
          } else {
            memorySource = memorySources[0];
          }

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
          // Read and modify XML for both versions
          const content = await fs.promises.readFile(memorySources[0], 'utf-8');
          const modifiedContentA = await modifyMemoryXml(content, defaultMemoryData, 'A', mem);
          const modifiedContentB = await modifyMemoryXml(content, defaultMemoryData, 'B', mem);
          // Write modified content to both A and B versions
          await fs.promises.writeFile(tempDestA, modifiedContentA, 'utf-8');
          await fs.promises.rename(tempDestA, memoryDestA);
          await fs.promises.writeFile(tempDestB, modifiedContentB, 'utf-8');
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

  // Modify COUNT based on version
  const countValue = version === 'A' ? '0001' : '0002';
  modifiedContent = modifiedContent.replace(/<count>\d+<\/count>/g, `<count>${countValue}</count>`);
  // Update the ID TAGS with zero-based memory number
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
  // Modify KEY in all TRACKS
  modifiedContent = modifiedContent.replace(
    /<AB_HARMONIST_MANUAL>[\s\S]*?<D>\d+<\/D>[\s\S]*?<\/AB_HARMONIST_MANUAL>/g,
    match => match.replace(/<D>\d+<\/D>/, `<D>${currentData.keyTrue.rc600Value}</D>`)
  );
  // Modify Rhythm On Off setting
  modifiedContent = modifiedContent.replace(
    /<RHYTHM>[\s\S]*?<M>\d+<\/M>[\s\S]*?<\/RHYTHM>/g,
    match => match.replace(/<M>\d+<\/M>/, `<M>${currentData.rhythm.rc600Value}</M>`)
  );

  if (currentData.rhythm.value === 'OFF') {
    return modifiedContent;
  }

  ////////////////////////////////////////////////////////////////////////////////

  // Modify BPM in MASTER
  modifiedContent = modifiedContent.replace(
    /<MASTER>[\s\S]*?<A>\d+<\/A>[\s\S]*?<\/MASTER>/g,
    match => match.replace(/<A>\d+<\/A>/, `<A>${currentData.bpm.rc600Value}</A>`)
  );
  // Modify samplesPerMeasure in MASTER
  modifiedContent = modifiedContent.replace(
    /<MASTER>[\s\S]*?<B>\d+<\/B>[\s\S]*?<\/MASTER>/g,
    match => match.replace(/<B>\d+<\/B>/, `<B>${currentData.samplesPerMeasure.rc600Value}</B>`)
  );

  // Modify other RHYTHM settings
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

  return modifiedContent;
}
////////////////////////////////////////////////////////////////////////////////

async function handleCopyWaveFiles(xmlDataTemplateFolder, waveFolder, data) {
  const wave2_4Source = path.join(xmlDataTemplateFolder, '2_4', '222_2.WAV');
  const wave3_4Source = path.join(xmlDataTemplateFolder, '3_4', '333_3.WAV');
  const wave4_4Source = path.join(xmlDataTemplateFolder, '4_4', '444_4.WAV');
  const wave5_8Source = path.join(xmlDataTemplateFolder, '5_8', '555_5.WAV');
  const wave7_8Source = path.join(xmlDataTemplateFolder, '7_8', '777_7.WAV');
  const wave9_8Source = path.join(xmlDataTemplateFolder, '9_8', '999_9.WAV');
  const waveSources = [
    wave2_4Source,
    wave3_4Source,
    wave4_4Source,
    wave5_8Source,
    wave7_8Source,
    wave9_8Source,
  ];

  let dataIndex = 0;
  try {
    for (let mem = 1; mem <= 99; mem++) {
      const memoryNumber = mem.toString().padStart(3, '0');

      try {
        if (dataIndex < data.length) {
          const currentData = data[dataIndex];
          dataIndex++;
          const timeSignature = currentData.timeSignature.value;
          const rhythmOnOff = currentData.rhythm.value;

          if (rhythmOnOff === 'ON') {
            const timeSignatureMap = {
              '2/4': 0,
              '3/4': 1,
              '4/4': 2,
              '5/8': 3,
              '7/8': 4,
              '9/8': 5,
            };
            const sourceIndex = timeSignatureMap[timeSignature];
            if (sourceIndex !== undefined) {
              const wavSource = waveSources[sourceIndex];
              const targetFolder = path.join(waveFolder, `${memoryNumber}_6`);
              const targetFileName = `${memoryNumber}_6.WAV`;
              const targetPath = path.join(targetFolder, targetFileName);
              await fs.promises.mkdir(targetFolder, { recursive: true });
              await fs.promises.copyFile(wavSource, targetPath);
            }
          }
        }
      } catch (error) {
        throw new Error(`Failed to copy WAV file for MEMORY${memoryNumber}: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to process WAV files: ${error.message}`);
  }
}

////////////////////////////////////////////////////////////////////////////////

async function getTxtFilesWithContent(folderPath) {
  return Promise.all(
    fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.txt'))
      .map(async file => {
        const filePath = path.join(folderPath, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return { name: file, path: filePath, content };
      })
  );
}

////////////////////////////////////////////////////////////////////////////////

const defaultMemoryData = {
  bpm: { value: 120, rc600Value: 1200 },
  genre: { value: 'USER', rc600Value: 20 },
  keyTrue: { value: 'C', rc600Value: 0 },
  kit: { value: 'BRUSH', rc600Value: 7 },
  name: {
    value: 'Empty',
    rc600Value: [69, 109, 112, 116, 121, 32, 32, 32, 32, 32, 32, 32],
  },
  pattern: { value: '__4A_', rc600Value: 5 },
  rhythm: { value: 'OFF', rc600Value: 0 },
  timeSignature: { value: '2/4', rc600Value: 0 },
  variation: { value: 'A', rc600Value: 0 },
  samplesPerMeasure: { value: 'SAMPLES', rc600Value: 44100 },
};

////////////////////////////////////////////////////////////////////////////////
