import "./App.css";
import * as React from "react";
import SetListsHeader from "./components/SetListsHeader.jsx";
import SetListsFinalHeader from "./components/SetListsFinalHeader.jsx";
import SetListSongsHeader from "./components/SetListSongsHeader.jsx";
import RepertoireHeader from "./components/RepertoireHeader.jsx";
import SettingsHeader from "./components/SettingsHeader.jsx";
import SetListsContainer from "./components/SetListsContainer.jsx";
import SetListsFinalContainer from "./components/SetListsFinalContainer.jsx";
import SetListSongsContainer from "./components/SetListSongsContainer.jsx";
import RepertoireContainer from "./components/RepertoireContainer.jsx";
import SettingsContainer from "./components/SettingsContainer.jsx";

import { ShowSetListSongsDetailsProvider } from "./contexts/ShowSetListSongsDetailsContext.js";
import { ShowRepertoireDetailsProvider } from "./contexts/ShowRepertoireDetailsContext.js";
import { SearchSongsProvider } from "./contexts/SearchSongsContext.js";

function App() {
  return (
    <div className="main">
      <div className="container">
        <SetListsHeader />
        <SetListsContainer />
        <SetListsFinalHeader />
        <SetListsFinalContainer />
      </div>

      <div className="container">
        <ShowSetListSongsDetailsProvider>
          <SetListSongsHeader />
          <SetListSongsContainer />
        </ShowSetListSongsDetailsProvider>
      </div>
      <div className="container">
        <ShowRepertoireDetailsProvider>
          <SearchSongsProvider>
            <RepertoireHeader />
            <RepertoireContainer />
          </SearchSongsProvider>
        </ShowRepertoireDetailsProvider>
      </div>

      <div className="container">
        <SettingsHeader />
        <SettingsContainer />
      </div>
    </div>
  );
}

export default App;
