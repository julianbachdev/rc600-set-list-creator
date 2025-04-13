import { createTextFiles, overWriteTextFile, refreshFiles } from '../utils/dataHelpers.js';
import { useSelectedSongContext } from '../contexts/SelectedSongContext.js';
import { useRepertoireContext } from '../contexts/RepertoireContext.js';
import CreateRc600Files from './settings/CreateRc600Files.jsx';
import { rhythmSettingsDefault } from '../data/rhythmData.js';
import TimeSignature from './settings/TimeSignature.jsx';
import FootSwitch from './settings/FootSwitch.jsx';
import React, { useState, useEffect } from 'react';
import Variation from './settings/Variation.jsx';
import LoopNotes from './settings/LoopNotes.jsx';
import Pattern from './settings/Pattern.jsx';
import KeyTrue from './settings/KeyTrue.jsx';
import Assign from './settings/Assign.jsx';
import Genre from './settings/Genre.jsx';
import Name from './settings/Name.jsx';
import Kit from './settings/Kit.jsx';
import Bpm from './settings/Bpm.jsx';
import Key from './settings/Key.jsx';

function PresetSettingsContainer() {
  const { repertoire, handleSetRepertoire } = useRepertoireContext();
  const { selectedSong, setSelectedSong } = useSelectedSongContext();
  const [overwrite, setOverwrite] = useState(false);
  const [songSettings, setSongSettings] = useState({
    content: '',
    name: '',
    settings: { ...rhythmSettingsDefault },
  });

  useEffect(() => {
    const selectedSongData = repertoire.find(song => song.name === selectedSong) || {};

    setSongSettings({
      content: selectedSongData.content || '',
      name: selectedSongData.name || '',
      path: selectedSongData.path || '',
      settings: {
        bpm: selectedSongData.settings?.bpm || rhythmSettingsDefault.bpm,
        genre: selectedSongData.settings?.genre || rhythmSettingsDefault.genre,
        key: selectedSongData.settings?.key || rhythmSettingsDefault.key,
        keyTrue: selectedSongData.settings?.keyTrue || rhythmSettingsDefault.keyTrue,
        kit: selectedSongData.settings?.kit || rhythmSettingsDefault.kit,
        loop: selectedSongData.settings?.loop || rhythmSettingsDefault.loop,
        name: selectedSongData.settings?.name || rhythmSettingsDefault.name,
        pattern: selectedSongData.settings?.pattern || rhythmSettingsDefault.pattern,
        rhythm: selectedSongData.settings?.rhythm || rhythmSettingsDefault.rhythm,
        timeSignature:
          selectedSongData.settings?.timeSignature || rhythmSettingsDefault.timeSignature,
        tuning: selectedSongData.settings?.tuning || rhythmSettingsDefault.tuning,
        variation: selectedSongData.settings?.variation || rhythmSettingsDefault.variation,
      },
    });
  }, [selectedSong, repertoire]);

  async function handleSaveChanges() {
    if (!selectedSong) return;
    overWriteTextFile(songSettings, overwrite);
    setSelectedSong('');
  }

  useEffect(() => {
    if (selectedSong === '') {
      refreshFiles(handleSetRepertoire);
    }
  }, [selectedSong]);

  function handleFileNameChange(newFileName) {
    setSongSettings(prev => ({ ...prev, name: newFileName }));
  }

  function handleSettingChange(settingKey, value) {
    setSongSettings(prev => ({
      ...prev,
      settings: { ...prev.settings, [settingKey]: value },
    }));
  }

  return (
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
      <LoopNotes
        loop={songSettings.settings.loop}
        handleChange={value => handleSettingChange('loop', value)}
      />

      <div className="flex">
        <Key
          keyValue={songSettings.settings.key}
          handleChange={value => handleSettingChange('key', value)}
        />
        <KeyTrue
          keyTrue={songSettings.settings.keyTrue}
          tuning={songSettings.settings.tuning}
          handleChange={value => handleSettingChange('keyTrue', value)}
        />
      </div>

      <div className="flex">
        <TimeSignature
          value={songSettings.settings.timeSignature}
          handleChange={value => handleSettingChange('timeSignature', value)}
        />
        <Bpm
          bpmValue={songSettings.settings.bpm}
          handleChange={value => handleSettingChange('bpm', value)}
        />
      </div>

      <div className="flex">
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

      <div className="flex">
        <Variation
          variation={songSettings.settings.variation}
          handleChange={value => handleSettingChange('variation', value)}
        />
        <Kit
          kit={songSettings.settings.kit}
          handleChange={value => handleSettingChange('kit', value)}
        />
      </div>

      <button className="btn-red w-full py-2" onClick={() => setOverwrite(prev => !prev)}>
        {overwrite ? 'Overwrite' : "Don't Overwrite"}
      </button>
      <button className="btn-blue w-full py-2" onClick={handleSaveChanges}>
        Save Changes
      </button>

      <FootSwitch />
      <Assign />
      <CreateRc600Files />

      <button className="btn-blue w-full py-2" onClick={() => createTextFiles(repertoire)}>
        Create New Text Files
      </button>
    </div>
  );
}

export default PresetSettingsContainer;
