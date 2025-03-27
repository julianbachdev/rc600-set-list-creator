import React, { useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { useSetListsContext } from "../contexts/SetListsContext";
import { useSelectedSetListContext } from "../contexts/SelectedSetListContext";
import {
  reorderSetListSongs,
  removeSongFromSetList,
  handleAutoScroll,
} from "../utils/setListHelpers";
import { useShowSetListSongsDetailsContext } from "../contexts/ShowSetListSongsDetailsContext.js";
import { formatSongName } from "../utils/utilityHelpers.js";

function SetListSongsContainer() {
  const { setLists, setSetLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { showSetListSongsDetails } = useShowSetListSongsDetailsContext();

  const listRef = useRef(null);
  const prevListLength = useRef(0);
  const selectedSetListSongs =
    setLists.find((s) => s.setListName === selectedSetList)?.setListSongs || [];

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
      className="h-full list-container overflow-y-auto"
      onReorder={(newOrder) => {
        handleReorderSetListSongs(newOrder);
      }}
    >
      {selectedSetListSongs.map((item, index) => {
        const itemColor =
          index % 2 === 0 ? "item-color-even" : "item-color-odd";

        return (
          <Reorder.Item
            key={item}
            value={item}
            className={`list-item ${itemColor}`}
            whileDrag={{ scale: 1.1 }}
          >
            {handleFormatSongName(item)}
            <button
              className="btn-red"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveSongFromSetList(item);
              }}
            >
              &#10006;
            </button>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

export default SetListSongsContainer;
