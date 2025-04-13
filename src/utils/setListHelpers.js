export function toggleSelectedSetList(setListName, selectedSetList, setSelectedSetList) {
  setSelectedSetList(setListName === selectedSetList ? '' : setListName);
}

////////////////////////////////////////////////////////////////////////////////

export function createSetList(newSetList, setSetLists, setLists) {
  if (!newSetList) return;
  if (setLists.some(setList => setList.setListName === newSetList)) {
    alert('Set list already exists!');
    return;
  }
  setSetLists(prev => [...prev, { setListName: newSetList, setListSongs: [] }]);
}

////////////////////////////////////////////////////////////////////////////////

export function deleteSetList(setListName, setSetLists, setSetListsFinal) {
  if (!confirm('Are you sure you want to delete this set list?')) return;
  setSetLists(prev => prev.filter(setList => setList.setListName !== setListName));
  setSetListsFinal(prev => prev.filter(item => item !== setListName));
}

////////////////////////////////////////////////////////////////////////////////

export function addSetListFinal(setListName, setListsFinal, setSetListsFinal) {
  if (setListsFinal.includes(setListName)) {
    alert('You have already added this playlist');
    return;
  }
  setSetListsFinal(prev => [...prev, setListName]);
}

////////////////////////////////////////////////////////////////////////////////

export function removeSetListFinal(setListName, setSetListsFinal) {
  setSetListsFinal(prev => prev.filter(item => item !== setListName));
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
  setSetLists(prev =>
    prev.map(set =>
      set.setListName === selectedSetList ? { ...set, setListSongs: newOrder } : set
    )
  );
}

////////////////////////////////////////////////////////////////////////////////

export function removeSongFromSetList(songToRemove, selectedSetList, setSetLists) {
  setSetLists(prev =>
    prev.map(set =>
      set.setListName === selectedSetList
        ? {
            ...set,
            setListSongs: set.setListSongs.filter(song => song !== songToRemove),
          }
        : set
    )
  );
}

////////////////////////////////////////////////////////////////////////////////

export function toggleAddRemoveSongsFromSetList(song, selectedSetList, setSetLists) {
  if (!selectedSetList) return;
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
