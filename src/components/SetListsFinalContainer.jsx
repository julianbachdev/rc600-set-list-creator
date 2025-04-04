import {
  toggleSelectedSetList,
  removeSetListFinal,
  handleAutoScroll,
} from '../utils/setListHelpers';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSetListsFinalContext } from '../contexts/SetListsFinalContext';
import React, { useState, useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';

function SetListsFinalContainer() {
  // console.log('SETLIST FINAL CONTAINER');

  const [isDragging, setIsDragging] = useState(false);
  const { selectedSetList, setSelectedSetList } = useSelectedSetListContext();
  const { setListsFinal, setSetListsFinal } = useSetListsFinalContext();
  const listRef = useRef(null);
  const prevListLength = useRef(setListsFinal.length);

  function handleToggleSelectedSetList(setListName) {
    toggleSelectedSetList(setListName, selectedSetList, setSelectedSetList);
  }

  function handleRemoveSetListFinal(setListName) {
    removeSetListFinal(setListName, setSetListsFinal);
  }

  useEffect(() => {
    handleAutoScroll(listRef, setListsFinal, prevListLength);
  }, [setListsFinal]);

  return (
    <Reorder.Group
      axis="y"
      values={setListsFinal}
      onReorder={setSetListsFinal}
      className="list-container h-1/2 overflow-y-auto"
      ref={listRef}
    >
      {setListsFinal.map((item, index) => {
        const isSelected = item === selectedSetList;
        const itemColor = index % 2 === 0 ? 'item-color-even' : 'item-color-odd';
        const itemClass = isSelected ? 'list-item is-selected' : `list-item ${itemColor}`;

        return (
          <Reorder.Item
            key={item}
            value={item}
            className={itemClass}
            whileDrag={{ scale: 1.1 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            onClick={() => !isDragging && handleToggleSelectedSetList(item)}
          >
            {item}
            <button
              className="btn-red"
              onClick={e => {
                e.stopPropagation();
                handleRemoveSetListFinal(item);
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

export default SetListsFinalContainer;
