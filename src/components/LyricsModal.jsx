import { useToggleOpenLyricsModalContext } from '../contexts/ToggleOpenLyricsModalContext';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useRepertoireContext } from '../contexts/RepertoireContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import { formatSongName } from '../utils/utilityHelpers';
import React, { useEffect, useState } from 'react';

function Modal() {
  const { songFile, repertoireOrSetList, handleToggleOpenLyricsModal } =
    useToggleOpenLyricsModalContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const [showDetails, setShowDetails] = useState(false);

  function toggleDetails() {
    setShowDetails(prev => !prev);
  }

  function handleSongNavigation(direction) {
    const isRepertoire = repertoireOrSetList === 'repertoire';
    const songList = isRepertoire
      ? repertoire
      : setLists.find(s => s.setListName === selectedSetList)?.setListSongs || [];
    const currentIndex = songList.findIndex(
      song => (isRepertoire ? song.name : song) === songFile.name
    );
    if (currentIndex === -1) return;
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= songList.length) return;
    const nextSong = songList[nextIndex];
    handleToggleOpenLyricsModal(nextSong.name || nextSong, true);
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (event.target.classList.contains('modal-container')) {
        handleToggleOpenLyricsModal('', '', false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleToggleOpenLyricsModal]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'ArrowLeft') {
        handleSongNavigation(-1);
      } else if (event.key === 'ArrowRight') {
        handleSongNavigation(1);
      } else if (event.key === 'Escape') {
        handleToggleOpenLyricsModal('', '', false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [songFile, repertoireOrSetList, repertoire, setLists, selectedSetList]);

  return (
    <div className="modal-container">
      <div className="modal-header">
        {formatSongName(songFile.name, showDetails)}
        <div>
          <button onClick={toggleDetails} className="modal-show-details-btn">
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <button
            onClick={() => handleToggleOpenLyricsModal('', '', false)}
            className="modal-close-btn"
          >
            Close
          </button>
        </div>
      </div>
      <div className="modal-body">
        <button
          onClick={() => handleSongNavigation(-1)}
          className="modal-nav-button btn-blue left-0"
        >
          &#x25C0;
        </button>
        <div className="text-sm">{songFile.content}</div>
        <button
          onClick={() => handleSongNavigation(1)}
          className="modal-nav-button btn-blue right-0"
        >
          &#x25B6;
        </button>
      </div>
    </div>
  );
}

export default Modal;
