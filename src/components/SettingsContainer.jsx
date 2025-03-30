import PresetSettingsContainer from './preset-settings/PresetSettingsContainer.jsx';
import CreateRc600Files from './preset-settings/CreateRc600Files.jsx';
import React from 'react';

function SettingsContainer() {
  return (
    <div className="container justify-between">
      <PresetSettingsContainer />
      <CreateRc600Files />
    </div>
  );
}

export default SettingsContainer;
