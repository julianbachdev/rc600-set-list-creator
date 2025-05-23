import SetListsFinalContainer from './components/SetListsFinalContainer.jsx';
import SetListSongsContainer from './components/SetListSongsContainer.jsx';
import SetListsFinalHeader from './components/SetListsFinalHeader.jsx';
import RepertoireContainer from './components/RepertoireContainer.jsx';
import SetListSongsHeader from './components/SetListSongsHeader.jsx';
import SetListsContainer from './components/SetListsContainer.jsx';
import SettingsContainer from './components/SettingsContainer.jsx';
import RepertoireHeader from './components/RepertoireHeader.jsx';
import SetListsHeader from './components/SetListsHeader.jsx';
import SettingsHeader from './components/SettingsHeader.jsx';
import * as React from 'react';
import './App.css';

import { useToggleOpenLyricsModalContext } from './contexts/ToggleOpenLyricsModalContext';
import { ShowSongDetailsProvider } from './contexts/ShowSongDetailsContext.js';
import { SearchSongsProvider } from './contexts/SearchSongsContext.js';
import LyricsModal from './components/LyricsModal.jsx';

function App() {
  const { toggleOpenLyricsModal } = useToggleOpenLyricsModalContext();

  return (
    <div className="main">
      <div className="container">
        <SetListsHeader />
        <SetListsContainer />
        <SetListsFinalHeader />
        <SetListsFinalContainer />
      </div>

      <div className="container">
        <ShowSongDetailsProvider>
          <SetListSongsHeader />
          <SetListSongsContainer />
        </ShowSongDetailsProvider>
      </div>

      <div className="container">
        <ShowSongDetailsProvider>
          <SearchSongsProvider>
            <RepertoireHeader />
            <RepertoireContainer />
          </SearchSongsProvider>
        </ShowSongDetailsProvider>
      </div>

      <div className="container">
        <SettingsHeader />
        <SettingsContainer />
      </div>

      {toggleOpenLyricsModal && <LyricsModal />}
    </div>
  );
}

export default App;
