export function extractTxtFileName(files) {
  return files.filter(file => file.name && file.name.includes('.txt')).map(file => file.name);
}

export function extractTxtFileContent(files) {
  return files.filter(file => file.content && file.name.includes('.txt')).map(file => file.content);
}

export function formatSongName(song, showDetails) {
  let cleanName = song.replace(/\.txt$/, '');
  if (!showDetails) {
    return cleanName.split(' - ')[0];
  }
  return cleanName;
}
