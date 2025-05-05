import { rhythmMenuData } from '../data/rhythmData';

export function getTimeSignatures() {
  const timeSignatureObjects = rhythmMenuData.filter(item => item.timeSignature);
  return timeSignatureObjects.map(item => ({
    name: item.timeSignature,
    value: item.value,
  }));
}

////////////////////////////////////////////////////////////////////////////////

export function getGenres(timeSignature) {
  const timeSignatureData = rhythmMenuData.find(item => item.timeSignature === timeSignature);
  if (!timeSignatureData) return [];
  return timeSignatureData.genre.map(genre => ({
    name: genre.name,
    value: genre.value,
  }));
}

////////////////////////////////////////////////////////////////////////////////

export function getPatterns(timeSignature, selectedGenre) {
  const timeSignatureData = rhythmMenuData.find(item => item.timeSignature === timeSignature);
  if (!timeSignatureData) return [];
  const genreData =
    timeSignatureData.genre.find(genre => genre.name === selectedGenre) ||
    timeSignatureData.genre[0];
  if (!genreData) return [];
  return genreData.pattern.map(pattern => ({
    name: pattern.name,
    value: pattern.value,
  }));
}

////////////////////////////////////////////////////////////////////////////////

export function getVariations() {
  const variationObject = rhythmMenuData.find(item => item.variation);
  if (!variationObject) return [];
  return variationObject.variation.map(variation => ({
    name: variation.name,
    value: variation.value,
  }));
}

////////////////////////////////////////////////////////////////////////////////

export function getKits() {
  const kitObject = rhythmMenuData.find(item => item.kit);
  if (!kitObject) return [];
  return kitObject.kit.map(kit => ({
    name: kit.name,
    value: kit.value,
  }));
}

////////////////////////////////////////////////////////////////////////////////

export function getKeyTrueValue(keyTrue, tuning) {
  const rc600keyOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const index = rc600keyOrder.indexOf(keyTrue);
  if (index === -1) return 0;
  let newIndex = (index + tuning) % 12;
  if (newIndex < 0) newIndex += 12;
  return newIndex;
}

////////////////////////////////////////////////////////////////////////////////

export function getSampleRatePerMeasure(bpm, timeSignature) {
  let secondsPerMeasure;
  const sampleRate = 441000;
  const secondsPerBeat = 60 / bpm;

  if (timeSignature === '2/4') {
    secondsPerMeasure = secondsPerBeat * 2;
  }
  if (timeSignature === '3/4') {
    secondsPerMeasure = secondsPerBeat * 3;
  }
  if (timeSignature === '4/4') {
    secondsPerMeasure = secondsPerBeat * 4;
  }
  if (timeSignature === '5/4') {
    secondsPerMeasure = secondsPerBeat * 5;
  }
  if (timeSignature === '6/4') {
    secondsPerMeasure = secondsPerBeat * 6;
  }
  if (timeSignature === '7/4') {
    secondsPerMeasure = secondsPerBeat * 7;
  }
  if (timeSignature === '5/8') {
    secondsPerMeasure = (secondsPerBeat * 5) / 2;
  }
  if (timeSignature === '6/8') {
    secondsPerMeasure = secondsPerBeat * 3;
  }
  if (timeSignature === '7/8') {
    secondsPerMeasure = (secondsPerBeat * 7) / 2;
  }
  if (timeSignature === '8/8') {
    secondsPerMeasure = secondsPerBeat * 4;
  }
  if (timeSignature === '9/8') {
    secondsPerMeasure = (secondsPerBeat * 9) / 2;
  }

  const samplesPerMeasure = secondsPerMeasure * sampleRate;
  const result = Math.floor(samplesPerMeasure / 10);
  return result;
}

////////////////////////////////////////////////////////////////////////////////
