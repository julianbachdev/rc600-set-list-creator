import {
  reorderSetListSongs,
  removeSongFromSetList,
  handleAutoScroll,
} from '../utils/setListHelpers';
import { useShowSetListSongsDetailsContext } from '../contexts/ShowSetListSongsDetailsContext.js';
import { useToggleOpenLyricsModalContext } from '../contexts/ToggleOpenLyricsModalContext.js';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import { formatSongName } from '../utils/utilityHelpers.js';
import React, { useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';

function SetListSongsContainer() {
  const { setLists, setSetLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { showSetListSongsDetails } = useShowSetListSongsDetailsContext();
  const { handleToggleOpenLyricsModal, setRepertoireOrSetList } = useToggleOpenLyricsModalContext();

  const listRef = useRef(null);
  const prevListLength = useRef(0);
  const selectedSetListSongs =
    setLists.find(s => s.setListName === selectedSetList)?.setListSongs || [];

  useEffect(() => {
    if (selectedSetListSongs.length) {
      handleAutoScroll(listRef, selectedSetListSongs, prevListLength);
    }
  }, [selectedSetListSongs]);

  function handleFormatSongName(song) {
    return formatSongName(song, showSetListSongsDetails);
  }

  function handleRemoveSongFromSetList(songToRemove) {
    removeSongFromSetList(selectedSetList, songToRemove, setSetLists);
  }

  function handleReorderSetListSongs(newOrder) {
    if (selectedSetList) {
      reorderSetListSongs(selectedSetList, newOrder, setSetLists);
    }
  }

  return (
    <Reorder.Group
      axis="y"
      values={selectedSetListSongs}
      ref={listRef}
      className="list-container h-full overflow-y-auto"
      onReorder={newOrder => {
        handleReorderSetListSongs(newOrder);
      }}
    >
      {selectedSetListSongs.map((item, index) => {
        const itemColor = index % 2 === 0 ? 'item-color-even' : 'item-color-odd';

        return (
          <Reorder.Item
            key={item}
            value={item}
            className={`list-item ${itemColor}`}
            whileDrag={{ scale: 1.1 }}
          >
            {handleFormatSongName(item)}
            <div>
              <button
                className="btn-blue"
                onClick={e => {
                  e.stopPropagation();
                  handleToggleOpenLyricsModal(item, selectedSetList, true);
                  setRepertoireOrSetList('setList');
                }}
              >
                Open
              </button>
              <button
                className="btn-red"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveSongFromSetList(item);
                }}
              >
                &#10006;
              </button>
            </div>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

export default SetListSongsContainer;
