import React, { useState, useEffect, useRef } from "react";
import { Reorder } from "framer-motion";
import { useSetListsFinalContext } from "../contexts/SetListsFinalContext";
import { useSelectedSetListContext } from "../contexts/SelectedSetListContext";
import {
  toggleSelectedSetList,
  removeSetListFinal,
  handleAutoScroll,
} from "../utils/setListHelpers";

function SetListsFinalContainer() {
  const [isDragging, setIsDragging] = useState(false);
  const { selectedSetList, setSelectedSetList } = useSelectedSetListContext();
  const { setListsFinal, setSetListsFinal } = useSetListsFinalContext();
  const listRef = useRef(null);
  const prevListLength = useRef(setListsFinal.length);

  function handleToggleSelectedSetList(setListName) {
    toggleSelectedSetList(setListName, selectedSetList, setSelectedSetList);
  }

  function handleRemoveSetListFinal(e, setListName) {
    removeSetListFinal(e, setListName, setSetListsFinal);
  }

  useEffect(() => {
    handleAutoScroll(listRef, setListsFinal, prevListLength);
  }, [setListsFinal]);

  return (
    <Reorder.Group
      axis="y"
      values={setListsFinal}
      onReorder={setSetListsFinal}
      className="h-1/2 list-container overflow-y-auto"
      ref={listRef}
    >
      {setListsFinal.map((item, index) => {
        const isSelected = item === selectedSetList;
        const itemColor =
          index % 2 === 0 ? "item-color-even" : "item-color-odd";
        const itemClass = isSelected
          ? "list-item is-selected"
          : `list-item ${itemColor}`;

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
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveSetListFinal(e, item);
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
