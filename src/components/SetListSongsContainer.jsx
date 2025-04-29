import {
  reorderSetListSongs,
  removeSongFromSetList,
  handleAutoScroll,
} from '../utils/setListHelpers';
import { useShowSetListSongsDetailsContext } from '../contexts/ShowSetListSongsDetailsContext.js';
import { useToggleOpenLyricsModalContext } from '../contexts/ToggleOpenLyricsModalContext.js';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSelectedSongContext } from '../contexts/SelectedSongContext.js';
import { useRepertoireContext } from '../contexts/RepertoireContext.js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSetListsContext } from '../contexts/SetListsContext';
import { formatSongName } from '../utils/utilityHelpers.js';
import { Reorder } from 'framer-motion';

function SetListSongsContainer() {
  const { setLists, setSetLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { showSetListSongsDetails } = useShowSetListSongsDetailsContext();
  const { handleToggleOpenLyricsModal, setRepertoireOrSetList } = useToggleOpenLyricsModalContext();
  const { selectedSong, setSelectedSong } = useSelectedSongContext();
  const [isDragging, setIsDragging] = useState(false);
  const listRef = useRef(null);
  const prevListLength = useRef(0);
  const selectedSetListSongs =
    setLists.find(s => s.setListName === selectedSetList)?.setListSongs || [];

  function handleReorderSetListSongs(newOrder) {
    if (selectedSetList) {
      reorderSetListSongs(selectedSetList, newOrder, setSetLists);
    }
  }

  const handleSelectedSong = useCallback(
    songName => {
      setSelectedSong(selectedSong !== songName ? songName : '');
    },
    [selectedSong, setSelectedSong]
  );

  useEffect(() => {
    if (selectedSetListSongs.length) {
      handleAutoScroll(listRef, selectedSetListSongs, prevListLength);
    }
  }, [selectedSetListSongs]);

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
