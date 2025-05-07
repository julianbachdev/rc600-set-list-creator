import React from 'react';

const notes = [
  'D#',
  'D',
  'C#',
  'C',
  'B',
  'A#',
  'A',
  'G#',
  'G',
  'F#',
  'F',
  'E',
  'D#',
  'D',
  'C#',
  'C',
  'B',
  'A#',
  'A',
  'G#',
  'G',
  'F#',
  'F',
];
const values = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11];

export default function ModalTuning({ onClose, setSelectedTuning, setTuning }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Create RC600 Files</h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Select Tuning</label>
          <select
            className="w-full rounded border p-2"
            defaultValue="11"
            onChange={e => {
              setTuning(values[Number(e.target.value)]);
            }}
          >
            {values.map((value, index) => (
              <option key={value} value={index}>
                {value} - {notes[index]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={() => setSelectedTuning(false)}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
