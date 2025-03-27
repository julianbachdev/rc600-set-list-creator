import React from "react";
import SearchInput from "./SearchInput.jsx";
import { useShowRepertoireDetailsContext } from "../contexts/ShowRepertoireDetailsContext.js";

function RepertoireHeader() {
  const { showRepertoireDetails, handleSetShowRepertoireDetails } =
    useShowRepertoireDetailsContext();

  const buttonLabel = showRepertoireDetails ? "Hide Details" : "Show Details";

  return (
    <div className="header-container">
      <div className="header-container-label">
        <h2>REPERTOIRE</h2>
        <button
          className="btn-blue"
          // NOT optimised
          // onClick={() => handleSetShowRepertoireDetails()}

          // optimised
          onClick={handleSetShowRepertoireDetails}
        >
          {buttonLabel}
        </button>
      </div>
      <SearchInput />
    </div>
  );
}

export default RepertoireHeader;
