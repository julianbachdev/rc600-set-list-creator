import { useShowRepertoireDetailsContext } from '../contexts/ShowRepertoireDetailsContext.js';
import { useToggleOpenLyricsModalContext } from '../contexts/ToggleOpenLyricsModalContext.js';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { toggleAddRemoveSongsFromSetList } from '../utils/setListHelpers.js';
import { useSelectedSongContext } from '../contexts/SelectedSongContext.js';
import { useSearchSongsContext } from '../contexts/SearchSongsContext';
import { useRepertoireContext } from '../contexts/RepertoireContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import { formatSongName } from '../utils/utilityHelpers.js';
import React from 'react';

function RepertoireContainer() {
  const { repertoire } = useRepertoireContext();
  const { searchSongs } = useSearchSongsContext();
  const { setLists, setSetLists } = useSetListsContext();
  const { showRepertoireDetails } = useShowRepertoireDetailsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { handleToggleOpenLyricsModal, setRepertoireOrSetList } = useToggleOpenLyricsModalContext();
  const { selectedSong, setSelectedSong } = useSelectedSongContext();
  const searchTerm = searchSongs.toLowerCase();
  const songs = repertoire.filter(item => {
    return item.name.toLowerCase().includes(searchTerm);
  });

  function handleSelectedSong(songName) {
    if (selectedSong !== songName) {
      setSelectedSong(songName, repertoire);
    } else {
      setSelectedSong('');
    }
  }

  return (
    <ul className="list-container h-full">
      {songs.map((item, index) => {
        const isSelected = setLists.some(
          ({ setListName, setListSongs }) =>
            setListName === selectedSetList && setListSongs?.includes(item.name)
        );

        const itemClass =
          selectedSong === item.name
            ? 'list-item bg-blue-color'
            : isSelected
              ? 'list-item is-selected'
              : `list-item ${index % 2 === 0 ? 'item-color-even' : 'item-color-odd'}`;

        const btnClass = isSelected ? 'btn-red' : `btn-green`;

        return (
          <li
            key={item.name}
            className={itemClass}
            onClick={() => {
              handleSelectedSong(item.name);
            }}
          >
            {formatSongName(item.name, showRepertoireDetails)}
            <div>
              <button
                className={btnClass}
                onClick={e => {
                  e.stopPropagation();
                  toggleAddRemoveSongsFromSetList(item.name, selectedSetList, setSetLists);
                }}
              >
                {isSelected ? '✖' : '✔'}
              </button>
              <button
                className="btn-blue"
                onClick={e => {
                  e.stopPropagation();
                  handleToggleOpenLyricsModal(item.name, 'repertoire', true);
                  setRepertoireOrSetList('repertoire');
                }}
              >
                {'📄'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default RepertoireContainer;
