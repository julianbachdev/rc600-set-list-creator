import React from "react";

const beats = [
  "Genre",
  "Shuffle",
  "Swing",
  "Half-Time",
  "Double-Time",
  "Triplet Feel",
  "Off-Beat",
  "Funk Groove",
  "Syncopated",
  "Polyrhythm",
];

function PatternGenre() {
  return (
    <select className="header-input">
      {beats.map((beat) => (
        <option key={beat} value={beat}>
          {beat}
        </option>
      ))}
    </select>
  );
}

export default PatternGenre;
