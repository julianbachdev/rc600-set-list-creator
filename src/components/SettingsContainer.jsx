import React from "react";
import { useSetListsContext } from "../contexts/SetListsContext";
import { useSelectedSetListContext } from "../contexts/SelectedSetListContext";
import { useSetListsFinalContext } from "../contexts/SetListsFinalContext";
import { useRepertoireContext } from "../contexts/RepertoireContext";
import { hardSaveSetListsData } from "../utils/dataHelpers";

function SettingsContainer() {
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { setListsFinal } = useSetListsFinalContext();

  function handleHardSaveSetListsData() {
    const data = {
      setLists: setLists,
      setListsFinal: setListsFinal,
    };
    hardSaveSetListsData(data);
  }

  return (
    <div className="h-full flex flex-col justify-between items-start">
      <div></div>
      <button
        className="w-full h-[50px] btn-blue"
        onClick={() => {
          console.log("repertoire", repertoire);
          console.log("setLists", setLists);
          console.log("selectedSetList", selectedSetList);
          console.log("setListsFinal", setListsFinal);
        }}
      >
        CREATE RC600 FILES
      </button>
      <button
        className="w-full h-[50px] btn-blue"
        onClick={handleHardSaveSetListsData}
      >
        SAVE
      </button>
    </div>
  );
}

export default SettingsContainer;
