import { toggleSelectedSetList, addSetListFinal, deleteSetList } from '../utils/setListHelpers';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSetListsFinalContext } from '../contexts/SetListsFinalContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import { Reorder } from 'framer-motion';
import React, { useState } from 'react';

function SetListsContainer() {
  // console.log('SETLIST CONTAINER');

  const [isDragging, setIsDragging] = useState(false);
  const { setLists, setSetLists } = useSetListsContext();
  const { selectedSetList, setSelectedSetList } = useSelectedSetListContext();
  const { setListsFinal, setSetListsFinal } = useSetListsFinalContext();

  function handleToggleSelectedSetList(setListName) {
    toggleSelectedSetList(setListName, selectedSetList, setSelectedSetList);
  }

  function handleAddSetListsFinal(e, setListName) {
    addSetListFinal(e, setListName, setListsFinal, setSetListsFinal);
  }

  return (
    <Reorder.Group
      axis="y"
      values={setLists}
      onReorder={setSetLists}
      className="list-container h-1/2"
    >
      {setLists.map((item, index) => {
        const isSelected = item.setListName === selectedSetList;
        const itemColor = index % 2 === 0 ? 'item-color-even' : 'item-color-odd';
        const itemClass = isSelected ? 'list-item is-selected' : `list-item ${itemColor}`;

        return (
          <Reorder.Item
            key={item.setListName}
            value={item}
            className={itemClass}
            whileDrag={{ scale: 1.1 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            onClick={() => !isDragging && handleToggleSelectedSetList(item.setListName)}
          >
            {item.setListName}
            <div>
              <button
                className="btn-green"
                onClick={e => {
                  e.stopPropagation();
                  handleAddSetListsFinal(e, item.setListName);
                }}
              >
                &#10004;
              </button>
              <button
                className="btn-red"
                onClick={e => {
                  e.stopPropagation();
                  deleteSetList(e, item.setListName, setSetLists);
                }}
              >
                &#10006;
              </button>
            </div>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

export default SetListsContainer;
