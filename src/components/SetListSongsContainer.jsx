import {
  reorderSetListSongs,
  removeSongFromSetList,
  handleAutoScroll,
} from '../utils/setListHelpers';
import { useToggleOpenLyricsModalContext } from '../contexts/ToggleOpenLyricsModalContext.js';
import { useShowSongDetailsContext } from '../contexts/ShowSongDetailsContext.js';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSelectedSongContext } from '../contexts/SelectedSongContext.js';
import { useSetListsContext } from '../contexts/SetListsContext';
import { formatSongName } from '../utils/utilityHelpers.js';
import React, { useEffect, useRef, useState } from 'react';
import { Reorder } from 'framer-motion';

function SetListSongsContainer() {
  const { setLists, setSetLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { showSetListSongsDetails } = useShowSongDetailsContext();
  const { selectedSong, setSelectedSong } = useSelectedSongContext();
  const { handleToggleOpenLyricsModal, setRepertoireOrSetList } = useToggleOpenLyricsModalContext();
  const [isDragging, setIsDragging] = useState(false);

  const selectedSetListSongs =
    setLists.find(s => s.setListName === selectedSetList)?.setListSongs || [];

  const listRef = useRef(null);
  const prevListLength = useRef(0);
  useEffect(() => {
    handleAutoScroll(listRef, selectedSetListSongs, prevListLength);
  }, [selectedSetListSongs]);

  function handleReorderSetListSongs(newOrder) {
    if (selectedSetList) {
      reorderSetListSongs(selectedSetList, newOrder, setSetLists);
    }
  }

  function handleSelectedSong(songName) {
    if (selectedSong !== songName) {
      setSelectedSong(songName);
    } else {
      setSelectedSong('');
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
        const itemClass =
          selectedSong === item
            ? 'list-item bg-blue-color'
            : `list-item ${index % 2 === 0 ? 'item-color-even' : 'item-color-odd'}`;

        return (
          <Reorder.Item
            key={item}
            value={item}
            className={itemClass}
            whileDrag={{ scale: 1.1 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            onClick={() => {
              !isDragging && handleSelectedSong(item);
            }}
          >
            <span className="list-text">{formatSongName(item, showSetListSongsDetails)}</span>
            <div>
              <button
                className="btn-red px-1 py-0.5"
                onClick={e => {
                  e.stopPropagation();
                  removeSongFromSetList(item, selectedSetList, setSetLists);
                }}
              >
                &#10006;
              </button>
              <button
                className="btn-blue ml-2 px-1.5 py-0.5"
                onClick={e => {
                  e.stopPropagation();
                  handleToggleOpenLyricsModal(item, selectedSetList, true);
                  setRepertoireOrSetList('setList');
                }}
              >
                {'📄'}
              </button>
            </div>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

export default SetListSongsContainer;
