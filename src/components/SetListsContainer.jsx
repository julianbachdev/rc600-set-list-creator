import {
  toggleSelectedSetList,
  addSetListFinal,
  deleteSetList,
  handleAutoScroll,
} from '../utils/setListHelpers';
import { useSelectedSetListContext } from '../contexts/SelectedSetListContext';
import { useSetListsFinalContext } from '../contexts/SetListsFinalContext';
import { useSetListsContext } from '../contexts/SetListsContext';
import React, { useState, useEffect, useRef } from 'react';
import { Reorder } from 'framer-motion';

function SetListsContainer() {
  const { setLists, setSetLists } = useSetListsContext();
  const { selectedSetList, setSelectedSetList } = useSelectedSetListContext();
  const { setListsFinal, setSetListsFinal } = useSetListsFinalContext();
  const [isDragging, setIsDragging] = useState(false);

  const listRef = useRef(null);
  const prevListLength = useRef(0);
  useEffect(() => {
    handleAutoScroll(listRef, setLists, prevListLength);
  }, [setLists]);

  return (
    <Reorder.Group
      axis="y"
      values={setLists}
      ref={listRef}
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
            onClick={() =>
              !isDragging &&
              toggleSelectedSetList(item.setListName, selectedSetList, setSelectedSetList)
            }
          >
            <span className="list-text">{item.setListName}</span>
            <div>
              <button
                className="btn-green px-1 py-0.5"
                onClick={e => {
                  e.stopPropagation();
                  addSetListFinal(item.setListName, setListsFinal, setSetListsFinal);
                }}
              >
                &#10004;
              </button>
              <button
                className="btn-red ml-2 px-1 py-0.5"
                onClick={e => {
                  e.stopPropagation();
                  deleteSetList(item.setListName, setSetLists, setSetListsFinal);
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
