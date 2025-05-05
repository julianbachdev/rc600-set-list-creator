import { getKeyTrueValue, getSampleRatePerMeasure } from './settingsHelpers';
import { rhythmMenuData } from '../data/rhythmData';

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

export function addSetListFinal(item, setListsFinal, setSetListsFinal) {
  if (setListsFinal.includes(item.setListName)) {
    alert('You have already added this playlist');
    return;
  }
  if (item.setListSongs.length > 0) setSetListsFinal(prev => [...prev, item.setListName]);
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

export function collectDataForRc600(repertoire, setLists, setListsFinal, tuning) {
  const orderedSongNames = getSongsFromSetLists(setLists, setListsFinal);
  const songsData = getSongDataFromSongList(repertoire, orderedSongNames);
  const songsDataAndValues = filterSongDataValues(songsData, rhythmMenuData, tuning);
  return songsDataAndValues;
}

////////////////////////////////////////////////////////////////////////////////

function getSongsFromSetLists(setLists, setListsFinal) {
  return setListsFinal.flatMap(setName =>
    setLists.filter(list => list.setListName === setName).flatMap(list => list.setListSongs)
  );
}

////////////////////////////////////////////////////////////////////////////////

function getSongDataFromSongList(repertoire, songList) {
  return songList
    .map(songName => repertoire.find(song => song.name === songName))
    .filter(Boolean)
    .map(song => {
      return { ...song };
    });
}

////////////////////////////////////////////////////////////////////////////////

function filterSongDataValues(songData, rhythmMenuData, tuning) {
  return songData.map((song, index) => {
    const { key, loop, ...settings } = song.settings || {};
    const newSettings = {};
    const defaultNameChar = `Memory(${index + 1})`;
    const paddedDefaultName = defaultNameChar.padEnd(12, ' ');
    const defaultName = paddedDefaultName.split('').map(char => char.charCodeAt(0));
    const keyTrueDefault = 0;
    const bpmDefault = 120;
    const variationDefault = 0;
    const kitDefault = 7;
    const timeSignatureDefault = 0;
    const genreDefault = 0;
    const patternDefault = 0;
    const rhythmDefault = 0;

    //Name
    newSettings.name = {
      value: settings.name || defaultName,
      rc600Value: (settings.name || defaultName)
        .padEnd(12, ' ')
        .split('')
        .map(char => char.charCodeAt(0)),
    };

    // Key True
    newSettings.keyTrue = {
      value: settings.keyTrue,
      rc600Value: settings.keyTrue ? getKeyTrueValue(settings.keyTrue, tuning) : keyTrueDefault,
    };

    // Bpm
    newSettings.bpm = {
      value: settings.bpm,
      rc600Value: settings.bpm ? settings.bpm * 10 : bpmDefault,
    };

    // Rhythm On Off
    newSettings.rhythm = {
      value: settings.rhythm,
      rc600Value: settings.rhythm === 'ON' ? 1 : rhythmDefault,
    };

    // Variation
    const rhythmDataForVariation = rhythmMenuData.find(item => item.variation);
    newSettings.variation = {
      value: settings.variation,
      rc600Value:
        rhythmDataForVariation?.variation.find(v => v.name === settings.variation)?.value ??
        variationDefault,
    };

    // Kit
    const rhythmDataForKit = rhythmMenuData.find(item => item.kit);
    newSettings.kit = {
      value: settings.kit,
      rc600Value: rhythmDataForKit?.kit.find(k => k.name === settings.kit)?.value ?? kitDefault,
    };

    // Time Signature
    const rhythmDataForTimeSignature = rhythmMenuData.find(
      item => item.timeSignature === settings.timeSignature
    );
    newSettings.timeSignature = {
      value: settings.timeSignature,
      rc600Value: rhythmDataForTimeSignature?.value ?? timeSignatureDefault,
    };

    // Genre
    newSettings.genre = {
      value: settings.genre,
      rc600Value:
        rhythmDataForTimeSignature?.genre.find(g => g.name === settings.genre)?.value ??
        genreDefault,
    };

    // Pattern
    newSettings.pattern = {
      value: settings.pattern,
      rc600Value:
        rhythmDataForTimeSignature?.genre
          .find(g => g.name === settings.genre)
          ?.pattern.find(p => p.name === settings.pattern)?.value ?? patternDefault,
    };

    // Samples Per Measure
    newSettings.samplesPerMeasure = {
      value: 'SAMPLES',
      rc600Value: getSampleRatePerMeasure(newSettings.bpm.value, newSettings.timeSignature.value),
    };

    return { ...settings, ...newSettings };
  });
}

////////////////////////////////////////////////////////////////////////////////
