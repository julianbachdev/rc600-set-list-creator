import React from "react";

const variations = ["Variation", "A", "B", "C", "D"];

function PatternVariation() {
  return (
    <select className="header-input">
      {variations.map((beat) => (
        <option key={beat} value={beat}>
          {beat}
        </option>
      ))}
    </select>
  );
}

export default PatternVariation;
