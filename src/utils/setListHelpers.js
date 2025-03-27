export function toggleSelectedSetList(
  setListName,
  selectedSetList,
  setSelectedSetList
) {
  setSelectedSetList(setListName === selectedSetList ? "" : setListName);
}

////////////////////////////////////////////////////////////////////////////////

export function createSetList(newSetList, setSetLists, setLists) {
  if (!newSetList) return;
  if (setLists.some((setList) => setList.setListName === newSetList)) {
    alert("Set list already exists!");
    return;
  }
  setSetLists((prev) => [
    ...prev,
    { setListName: newSetList, setListSongs: [] },
  ]);
}

////////////////////////////////////////////////////////////////////////////////

export function deleteSetList(e, setListName, setSetLists) {
  e.stopPropagation();
  if (!confirm("Are you sure you want to delete this set list?")) return;
  setSetLists((prev) =>
    prev.filter((setList) => setList.setListName !== setListName)
  );
}

////////////////////////////////////////////////////////////////////////////////

export function addSetListFinal(
  e,
  setListName,
  setListsFinal,
  setSetListsFinal
) {
  e.stopPropagation();
  if (setListsFinal.some((s) => s.setListName === setListName)) {
    alert("You have already added this playlist");
    return;
  }
  setSetListsFinal((prev) => [...prev, setListName]);
}

////////////////////////////////////////////////////////////////////////////////

export function removeSetListFinal(e, setListName, setSetListsFinal) {
  e.stopPropagation();
  setSetListsFinal((prev) => prev.filter((item) => item !== setListName));
}

////////////////////////////////////////////////////////////////////////////////

export function handleAutoScroll(listRef, setListsFinal, prevListLength) {
  if (listRef.current && setListsFinal.length > prevListLength.current) {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }
  prevListLength.current = setListsFinal.length;
}

////////////////////////////////////////////////////////////////////////////////

export function reorderSetListSongs(selectedSetList, newOrder, setSetLists) {
  setSetLists((prev) =>
    prev.map((set) =>
      set.setListName === selectedSetList
        ? { ...set, setListSongs: newOrder }
        : set
    )
  );
}

////////////////////////////////////////////////////////////////////////////////

export function removeSongFromSetList(
  selectedSetList,
  songToRemove,
  setSetLists
) {
  setSetLists((prev) =>
    prev.map((set) =>
      set.setListName === selectedSetList
        ? {
            ...set,
            setListSongs: set.setListSongs.filter(
              (song) => song !== songToRemove
            ),
          }
        : set
    )
  );
}
