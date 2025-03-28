import React from "react";
import { useSetListsContext } from "../../contexts/SetListsContext";
import { useSelectedSetListContext } from "../../contexts/SelectedSetListContext";
import { useSetListsFinalContext } from "../../contexts/SetListsFinalContext";
import { useRepertoireContext } from "../../contexts/RepertoireContext";
import { bpmMeasureLengths } from "../../data/settingsData.js";

function CreateRc600Files() {
  const { repertoire } = useRepertoireContext();
  const { setLists } = useSetListsContext();
  const { selectedSetList } = useSelectedSetListContext();
  const { setListsFinal } = useSetListsFinalContext();

  return (
    <button
      className="w-full btn-blue py-2"
      onClick={() => {
        console.log("repertoire", repertoire);
        console.log("setLists", setLists);
        console.log("selectedSetList", selectedSetList);
        console.log("setListsFinal", setListsFinal);
      }}
    >
      CREATE RC600 FILES
    </button>
  );
}

export default CreateRc600Files;
