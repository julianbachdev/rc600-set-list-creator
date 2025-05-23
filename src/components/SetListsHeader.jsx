import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import { createSetList } from '../utils/setListHelpers';
import React, { useState } from 'react';

function SetListsHeader() {
  const { setLists, setSetLists } = useSetListsContext();
  const { setSelectedSetList } = useSelectedSetListContext();
  const [newSetList, setNewSetList] = useState('');

  function handleCreateSetList() {
    createSetList(newSetList, setSetLists, setLists);
    setSelectedSetList(newSetList);
  }

  return (
    <div className="header-container">
      <div className="header-container-text m-1">SET LISTS</div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (newSetList.trim()) handleCreateSetList();
          setNewSetList('');
        }}
        className="header-container-input"
      >
        <input
          value={newSetList}
          onChange={e => setNewSetList(e.target.value)}
          className="header-input"
          placeholder="Enter name"
        />
        <button type="submit" disabled={!newSetList} className="btn-blue px-3">
          Add
        </button>
      </form>
    </div>
  );
}

export default SetListsHeader;
