import { ToggleOpenLyricsModalProvider } from './ToggleOpenLyricsModalContext.js';
import { SelectedSetListProvider } from './SelectedSetListContext.js';
import { SetListsFinalProvider } from './SetListsFinalContext.js';
import { SelectedSongProvider } from './SelectedSongContext.js';
import { RepertoireProvider } from './RepertoireContext.js';
import { SetListsProvider } from './SetListsContext.js';
import React from 'react';

export function AppProviders({ children }) {
  return (
    <SelectedSongProvider>
      <RepertoireProvider>
        <ToggleOpenLyricsModalProvider>
          <SetListsProvider>
            <SelectedSetListProvider>
              <SetListsFinalProvider>{children}</SetListsFinalProvider>
            </SelectedSetListProvider>
          </SetListsProvider>
        </ToggleOpenLyricsModalProvider>
      </RepertoireProvider>
    </SelectedSongProvider>
  );
}

export default AppProviders;
