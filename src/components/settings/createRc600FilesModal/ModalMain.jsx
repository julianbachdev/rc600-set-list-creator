import {
  selectPath,
  createRc600FolderStructure,
  populateRc600Folders,
  deleteFoldersOnError,
} from '../../../utils/dataHelpers.js';
import { useSetListsFinalContext } from '../../../contexts/SetListsFinalContext.js';
import { useRepertoireContext } from '../../../contexts/RepertoireContext.js';
import { useSetListsContext } from '../../../contexts/SetListsContext.js';
import { collectDataForRc600 } from '../../../utils/setListHelpers.js';
import { truncatePathToFit } from '../../../utils/utilityHelpers.js';
import { isValidFolderName } from '../../../utils/utilityHelpers.js';
import React, { useState, useRef, useEffect } from 'react';
import ModalTuning from './ModalTuning.jsx';
import ModalFinal from './ModalFinal.jsx';

export default function ModalMain({ isOpen, onClose }) {
  const { setLists } = useSetListsContext();
  const { repertoire } = useRepertoireContext();
  const { setListsFinal } = useSetListsFinalContext();
  const [error, setError] = useState('');
  const [tuning, setTuning] = useState(0);
  const [folderName, setFolderName] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [displayedPath, setDisplayedPath] = useState('');
  const [selectedTuning, setSelectedTuning] = useState(true);
  const [operationStatus, setOperationStatus] = useState(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!selectedTuning) {
      const fetchLastCreateRCFilesPath = async () => {
        try {
          const lastPath = await window.electron.ipcRenderer.getLastCreateRCFilesPath();
          if (lastPath) {
            setSelectedPath(lastPath);
          }
        } catch (err) {
          console.error('Error fetching last path:', err);
        }
      };
      fetchLastCreateRCFilesPath();
    }
  }, [selectedTuning]);

  function handleFolderNameChange(e) {
    setFolderName(e.target.value);
    setError('');
  }

  async function handleSelectPath() {
    const [path, error] = await selectPath();
    if (error) {
      setError('');
    } else if (path) {
      setSelectedPath(path);
      setError('');
    }
  }

  async function handleCreateRc600Files() {
    setError('');
    if (!isValidFolderName(folderName)) {
      setError('Please enter a valid folder name.');
      return;
    }
    if (!selectedPath) {
      setError('Please select a destination folder.');
      return;
    }
    try {
      // create folder structure
      const [folderSuccess, folderError] = await createRc600FolderStructure(
        selectedPath,
        folderName
      );

      if (!folderSuccess) {
        setError(folderError);
        setOperationStatus('error');
        return;
      }

      // populate folders
      const data = collectDataForRc600(repertoire, setLists, setListsFinal, tuning);
      const [success, error] = await populateRc600Folders(folderName, selectedPath, data);
      if (success) {
        setOperationStatus('success');
      } else {
        deleteFoldersOnError(error, selectedPath, folderName, setError, setOperationStatus);
      }
    } catch (err) {
      deleteFoldersOnError(
        'An unexpected error occurred.',
        selectedPath,
        folderName,
        setError,
        setOperationStatus
      );
    }
  }

  useEffect(() => {
    if (selectedPath && pathRef.current) {
      const containerWidth = pathRef.current.offsetWidth;
      const truncatedPath = truncatePathToFit(selectedPath, containerWidth);
      setDisplayedPath(truncatedPath);
    } else {
      setDisplayedPath('');
    }
  }, [selectedPath]);

  useEffect(() => {
    if (!isOpen) {
      setFolderName('');
      setSelectedPath('');
      setError('');
      setOperationStatus(null);
      setSelectedTuning(true);
      setTuning(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (operationStatus === 'success' || operationStatus === 'error') {
    return <ModalFinal operationStatus={operationStatus} error={error} onClose={onClose} />;
  }
  if (selectedTuning) {
    return (
      <ModalTuning onClose={onClose} setSelectedTuning={setSelectedTuning} setTuning={setTuning} />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Create RC600 Files</h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Destination Path</label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectPath}
              className="whitespace-nowrap rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              Browse
            </button>
            <div ref={pathRef} className="min-w-0 flex-1">
              <span
                className="block whitespace-nowrap text-left text-sm text-gray-600"
                title={selectedPath}
              >
                {selectedPath
                  ? displayedPath === selectedPath
                    ? displayedPath
                    : `...${displayedPath}`
                  : 'No path chosen'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Folder Name</label>
          <input
            type="text"
            value={folderName}
            onChange={handleFolderNameChange}
            className="w-full rounded border p-2"
            placeholder="Enter folder name"
          />
        </div>

        <div className="mb-4 min-h-[1.5rem]">
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleCreateRc600Files}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Create Now
          </button>
        </div>
      </div>
    </div>
  );
}
