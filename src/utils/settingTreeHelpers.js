import rhythmMenuData from '../data/rhythmData';

export function getTimeSignatures() {
  const timeSignatureObjects = rhythmMenuData.filter(item => item.timeSignature);
  return timeSignatureObjects.map(item => ({
    name: item.timeSignature,
    value: item.value,
  }));
}

export function getGenres(timeSignature) {
  const timeSignatureData = rhythmMenuData.find(item => item.timeSignature === timeSignature);
  if (!timeSignatureData) return [];
  return timeSignatureData.genre.map(genre => ({
    name: genre.name,
    value: genre.value,
  }));
}

export function getPatterns(timeSignature, selectedGenre) {
  const timeSignatureData = rhythmMenuData.find(item => item.timeSignature === timeSignature);
  if (!timeSignatureData) return [];
  const genreData = timeSignatureData.genre.find(genre => genre.name === selectedGenre);
  if (!genreData) return [];
  return genreData.pattern.map(pattern => ({
    name: pattern.name,
    value: pattern.value,
  }));
}

export function getVariations() {
  const variationObject = rhythmMenuData.find(item => item.variation);
  if (!variationObject) return [];
  return variationObject.variation.map(variation => ({
    name: variation.name,
    value: variation.value,
  }));
}

export function getKits() {
  const kitObject = rhythmMenuData.find(item => item.kit);
  if (!kitObject) return [];
  return kitObject.kit.map(kit => ({
    name: kit.name,
    value: kit.value,
  }));
}
