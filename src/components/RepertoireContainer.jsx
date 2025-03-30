import { useShowRepertoireDetailsContext } from '../contexts/ShowRepertoireDetailsContext.js';
import { useToggleOpenLyricsModalContext } from '../contexts/ToggleOpenLyricsModalContext.js';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
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

  const searchTerm = searchSongs.toLowerCase();
  const songs = repertoire.filter(item => {
    return item.name.toLowerCase().includes(searchTerm);
  });

  function handleAddRemoveSongsFromSetList(song) {
    setSetLists(prev =>
      prev.map(set => {
        if (set.setListName !== selectedSetList) return set;
        const isSongInList = set.setListSongs.includes(song);
        return {
          ...set,
          setListSongs: isSongInList
            ? set.setListSongs.filter(s => s !== song)
            : [...set.setListSongs, song],
        };
      })
    );
  }

  return (
    <ul className="list-container h-full">
      {songs.map((item, index) => {
        const itemColor = index % 2 === 0 ? 'item-color-even' : 'item-color-odd';

        const isSelected = setLists.some(
          ({ setListName, setListSongs }) =>
            setListName === selectedSetList && setListSongs?.includes(item.name)
        );

        const itemClass = isSelected ? 'list-item is-selected' : `list-item ${itemColor}`;

        return (
          <li
            key={item.name}
            className={itemClass}
            onClick={() => handleAddRemoveSongsFromSetList(item.name)}
          >
            {formatSongName(item.name, showRepertoireDetails)}

            <button
              className="btn-blue"
              onClick={e => {
                e.stopPropagation();
                handleToggleOpenLyricsModal(item.name, 'repertoire', true);
                setRepertoireOrSetList('repertoire');
              }}
            >
              Open
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default RepertoireContainer;
