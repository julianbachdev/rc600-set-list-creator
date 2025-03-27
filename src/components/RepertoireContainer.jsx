import React from "react";
import { useRepertoireContext } from "../contexts/RepertoireContext";
import { useSetListsContext } from "../contexts/SetListsContext";
import { useSelectedSetListContext } from "../contexts/SelectedSetListContext";
import { useSearchSongsContext } from "../contexts/SearchSongsContext";
import { useShowRepertoireDetailsContext } from "../contexts/ShowRepertoireDetailsContext.js";
import { formatSongName } from "../utils/utilityHelpers.js";

function RepertoireContainer() {
  const { repertoire } = useRepertoireContext();
  const { searchSongs } = useSearchSongsContext();
  const { setLists, setSetLists } = useSetListsContext();
  const { showRepertoireDetails } = useShowRepertoireDetailsContext();
  const { selectedSetList } = useSelectedSetListContext();

  const searchTerm = searchSongs.toLowerCase();
  const songs = repertoire.filter((item) =>
    item.toLowerCase().includes(searchTerm)
  );

  function handleAddRemoveSongs(song) {
    setSetLists((prev) =>
      prev.map((set) => {
        if (set.setListName !== selectedSetList) return set;
        const isSongInList = set.setListSongs.includes(song);
        return {
          ...set,
          setListSongs: isSongInList
            ? set.setListSongs.filter((s) => s !== song)
            : [...set.setListSongs, song],
        };
      })
    );
  }

  return (
    <ul className="h-full list-container">
      {songs.map((item, index) => {
        const itemColor =
          index % 2 === 0 ? "item-color-even" : "item-color-odd";

        const isSelected = setLists.some(
          ({ setListName, setListSongs }) =>
            setListName === selectedSetList && setListSongs?.includes(item)
        );

        const itemClass = isSelected
          ? "list-item is-selected"
          : `list-item ${itemColor}`;

        return (
          <li
            key={item}
            className={itemClass}
            onClick={() => handleAddRemoveSongs(item)}
          >
            {formatSongName(item, showRepertoireDetails)}
          </li>
        );
      })}
    </ul>
  );
}

export default RepertoireContainer;
