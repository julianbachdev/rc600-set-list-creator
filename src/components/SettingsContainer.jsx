import {
  overWriteTextFile,
  refreshFilesFromFolder,
  saveSetListsDataToFile,
  openFilesFromFolder,
} from '../utils/dataHelpers.js';
import CreateRc600Files from './settings/createRc600FilesModal/CreateRc600Files.jsx';
import { useSetListsFinalContext } from '../contexts/SetListsFinalContext.js';
import { useSelectedSongContext } from '../contexts/SelectedSongContext.js';
import { useRepertoireContext } from '../contexts/RepertoireContext.js';
import { useSetListsContext } from '../contexts/SetListsContext.js';
import { rhythmSettingsDefault } from '../data/rhythmData.js';
import TimeSignature from './settings/TimeSignature.jsx';
import React, { useState, useEffect } from 'react';
import Variation from './settings/Variation.jsx';
import LoopNotes from './settings/LoopNotes.jsx';
import Pattern from './settings/Pattern.jsx';
import KeyTrue from './settings/KeyTrue.jsx';
import Rhythm from './settings/Rhythm.jsx';
import Genre from './settings/Genre.jsx';
import Name from './settings/Name.jsx';
import Kit from './settings/Kit.jsx';
import Bpm from './settings/Bpm.jsx';
import Key from './settings/Key.jsx';

function PresetSettingsContainer() {
  const { setLists } = useSetListsContext();
  const { selectedSong } = useSelectedSongContext();
  const { setListsFinal } = useSetListsFinalContext();
  const { repertoire, handleSetRepertoire } = useRepertoireContext();
  const [overwrite, setOverwrite] = useState(true);
  const [songSettings, setSongSettings] = useState({
    content: '',
    name: '',
    settings: { ...rhythmSettingsDefault },
  });

  useEffect(() => {
    const selectedSongData = repertoire.find(song => song.name === selectedSong) || {};

    setSongSettings(prev => ({
      ...prev,
      content: selectedSongData.content || '',
      name: selectedSongData.name || '',
      path: selectedSongData.path || '',
      settings: {
        bpm: selectedSongData.settings?.bpm || rhythmSettingsDefault.bpm,
        genre: selectedSongData.settings?.genre || rhythmSettingsDefault.genre,
        key: selectedSongData.settings?.key || rhythmSettingsDefault.key,
        keyTrue:
          selectedSongData.settings?.keyTrue ||
          selectedSongData.settings?.key ||
          rhythmSettingsDefault.key,
        kit: selectedSongData.settings?.kit || rhythmSettingsDefault.kit,
        loop: selectedSongData.settings?.loop || rhythmSettingsDefault.loop,
        name: selectedSongData.settings?.name || rhythmSettingsDefault.name,
        pattern: selectedSongData.settings?.pattern || rhythmSettingsDefault.pattern,
        rhythm: selectedSongData.settings?.rhythm || rhythmSettingsDefault.rhythm,
        timeSignature:
          selectedSongData.settings?.timeSignature || rhythmSettingsDefault.timeSignature,
        variation: selectedSongData.settings?.variation || rhythmSettingsDefault.variation,
      },
    }));
  }, [selectedSong, repertoire]);

  useEffect(() => {
    refreshFilesFromFolder(handleSetRepertoire);
  }, []);

  function handleSaveSettingsChanges() {
    overWriteTextFile(songSettings, overwrite);
    refreshFilesFromFolder(handleSetRepertoire);
  }

  function handleFileNameChange(newFileName) {
    setSongSettings(prev => ({ ...prev, name: newFileName }));
  }

  function handleChangeLyrics(lyrics) {
    setSongSettings(prev => ({ ...prev, content: lyrics }));
  }

  function handleSettingChange(settingKey, value) {
    setSongSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, [settingKey]: value },
    }));
  }

  function handleSaveSetListsDataToFile() {
    const confirmed = window.confirm('Do you want to save the set lists?');
    if (!confirmed) return;
    const data = {
      setLists: setLists,
      setListsFinal: setListsFinal,
    };
    saveSetListsDataToFile(data);
  }

  return (
    <div className="list-container flex h-full flex-col justify-between">
      <div className="flex flex-col gap-2">
        <Name
          songName={songSettings.name}
          handleChange={handleFileNameChange}
          placeholder="File name"
        />
        <Name
          songName={songSettings.settings.name}
          handleChange={value => handleSettingChange('name', value)}
          placeholder="Preset name"
        />
        <div className="flex gap-2">
          <LoopNotes
            loop={songSettings.settings.loop}
            handleChange={value => handleSettingChange('loop', value)}
          />
          <Rhythm
            rhythm={songSettings.settings.rhythm}
            handleChange={value => handleSettingChange('rhythm', value)}
          />
        </div>

        <div className="flex gap-2">
          <Key
            keyValue={songSettings.settings.key}
            handleChange={value => handleSettingChange('key', value)}
          />
          <KeyTrue
            keyTrue={songSettings.settings.keyTrue}
            handleChange={value => handleSettingChange('keyTrue', value)}
          />
        </div>

        <div className="flex gap-2">
          <TimeSignature
            value={songSettings.settings.timeSignature}
            handleChange={value => handleSettingChange('timeSignature', value)}
          />
          <Bpm
            bpmValue={songSettings.settings.bpm}
            handleChange={value => handleSettingChange('bpm', value)}
          />
        </div>

        <div className="flex gap-2">
          <Genre
            genre={songSettings.settings.genre}
            timeSignature={songSettings.settings.timeSignature}
            handleChange={value => handleSettingChange('genre', value)}
          />
          <Pattern
            pattern={songSettings.settings.pattern}
            timeSignature={songSettings.settings.timeSignature}
            genre={songSettings.settings.genre}
            handleChange={value => handleSettingChange('pattern', value)}
          />
        </div>

        <div className="flex gap-2">
          <Variation
            variation={songSettings.settings.variation}
            handleChange={value => handleSettingChange('variation', value)}
          />
          <Kit
            kit={songSettings.settings.kit}
            handleChange={value => handleSettingChange('kit', value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="btn-red w-full truncate py-2"
            onClick={() => setOverwrite(prev => !prev)}
          >
            {overwrite ? 'Overwrite' : "Don't Overwrite"}
          </button>
          <button
            className="btn-blue w-full truncate py-2"
            onClick={() => handleSaveSettingsChanges()}
          >
            Save Settings
          </button>
        </div>
      </div>
      <textarea
        placeholder="Lyrics"
        className="text-area"
        value={songSettings.content}
        onChange={e => handleChangeLyrics(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => openFilesFromFolder(handleSetRepertoire)}
            className="btn-blue w-full truncate py-2"
          >
            Open Files
          </button>
          <button
            onClick={() => refreshFilesFromFolder(handleSetRepertoire)}
            className="btn-blue w-full truncate py-2"
          >
            Refresh Files
          </button>
          <button className="btn-blue w-full truncate py-2" onClick={handleSaveSetListsDataToFile}>
            Save SetLists
          </button>
        </div>
        <CreateRc600Files />
      </div>
    </div>
  );
}

export default PresetSettingsContainer;
