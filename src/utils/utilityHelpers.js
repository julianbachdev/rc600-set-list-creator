import { rhythmMenuData, rhythmSettingsDefault } from '../data/rhythmData.js';

export function extractTxtFileName(files) {
  return files.filter(file => file.name && file.name.includes('.txt')).map(file => file.name);
}

////////////////////////////////////////////////////////////////////////////////

export function extractTxtFileContent(files) {
  return files.filter(file => file.content && file.name.includes('.txt')).map(file => file.content);
}

////////////////////////////////////////////////////////////////////////////////

export function formatSongName(song, showDetails) {
  let cleanName = song.replace(/\.txt$/, '');
  if (!showDetails) {
    cleanName = cleanName.replace(/\s*\[.*?\]\s*/g, '').trim();
  }
  return cleanName;
}

////////////////////////////////////////////////////////////////////////////////

export function extractCapoNumber(str) {
  const match = str.match(/\(.*?capo(\d+).*?\)/i);
  return match ? parseInt(match[1], 10) : 0;
}

////////////////////////////////////////////////////////////////////////////////

export function extractMetadataFromContent(song) {
  const songName = song?.name ?? '';
  const settingsStructure = { ...rhythmSettingsDefault, name: shortenSongName(songName, 12) };
  const lines = song?.content?.split('\n') ?? [];
  const parsed = lines
    .filter(line => line.trim().startsWith('#'))
    .reduce((acc, line) => {
      const trimmed = line.trim().slice(1);
      const [key, ...rest] = trimmed.split(':');
      const cleanKey = key.trim();
      const value = rest.join(':').trim();
      if (cleanKey && value && cleanKey in rhythmSettingsDefault) {
        acc[cleanKey] = value;
      }
      return acc;
    }, {});

  if ('bpm' in parsed) {
    const bpm = Number(parsed.bpm);
    parsed.bpm =
      !Number.isInteger(bpm) || bpm <= 40 || bpm >= 300 ? rhythmSettingsDefault.bpm : bpm;
  }
  if ('key' in parsed) {
    const upperFirst = parsed.key.charAt(0).toUpperCase() + parsed.key.slice(1);
    const isValidNote = /^[A-G]/.test(upperFirst);
    parsed.key = isValidNote ? upperFirst : rhythmSettingsDefault.key;
  }
  if ('keyTrue' in parsed) {
    const upperFirst = parsed.keyTrue.charAt(0).toUpperCase() + parsed.keyTrue.slice(1);
    const isValidNote = /^[A-G]/.test(upperFirst);
    parsed.keyTrue = isValidNote ? upperFirst : parsed.key;
  }
  if ('kit' in parsed) {
    const validKits = rhythmMenuData[0].kit.map(item => item.name.toUpperCase());
    const kitValue = parsed.kit.toUpperCase();
    parsed.kit = validKits.includes(kitValue) ? kitValue : rhythmSettingsDefault.kit;
  }
  if ('loop' in parsed) {
    const loopValue = parsed.loop.toLowerCase();
    parsed.loop = loopValue === 'none' ? 'NONE' : loopValue;
  }
  if ('name' in parsed) {
    parsed.name = parsed.name.slice(0, 12);
  }
  if ('rhythm' in parsed) {
    const value = parsed.rhythm.toLowerCase();
    parsed.rhythm =
      value === 'on' || value === 'off' ? value.toUpperCase() : rhythmSettingsDefault.rhythm;
  }
  if ('tuning' in parsed) {
    const value = parsed.tuning;
    const num = Number(value);
    parsed.tuning = Number.isInteger(num) ? num : rhythmSettingsDefault.tuning;
  }
  if ('variation' in parsed) {
    const value = parsed.variation.toUpperCase();
    parsed.variation = ['A', 'B', 'C', 'D'].includes(value)
      ? value
      : rhythmSettingsDefault.variation;
  }
  if ('timeSignature' in parsed) {
    const value = parsed.timeSignature;
    parsed.timeSignature = rhythmMenuData
      .map(item => item?.timeSignature)
      .filter(Boolean)
      .includes(value)
      ? value
      : rhythmSettingsDefault.timeSignature;
  }
  if ('genre' in parsed) {
    const genreValue = parsed.genre;
    const timeSignature = parsed.timeSignature;
    const rhythmEntry = rhythmMenuData.find(item => item?.timeSignature === timeSignature);
    const genreExists = rhythmEntry?.genre?.some(item => item?.name === genreValue);
    parsed.genre = genreExists ? genreValue : rhythmEntry.genre[0].name;
  }

  if ('pattern' in parsed) {
    const patternValue = parsed.pattern;
    const timeSignature = parsed.timeSignature;
    const genre = parsed.genre;
    const rhythmEntry = rhythmMenuData.find(item => item?.timeSignature === timeSignature);
    const genreEntry = rhythmEntry?.genre?.find(item => item?.name === genre);
    const patternExists = genreEntry?.pattern?.some(item => item?.name === patternValue);
    parsed.pattern = patternExists ? patternValue : genreEntry.pattern[0].name;
  }
  return {
    ...settingsStructure,
    ...parsed,
  };
}

////////////////////////////////////////////////////////////////////////////////

function shortenSongName(songName, maxLength = 12) {
  // Step 1: Remove .txt extension
  let cleanedName = songName.replace('.txt', '').trim();
  // Step 2: Remove text inside square brackets
  cleanedName = cleanedName.replace(/\[.*?\]/g, '').trim();
  // Step 3: Remove everything that's not a letter or a number
  const stopPunctuation = /[^a-zA-Z0-9\s]/g; // Matches everything that is not a letter, number, or space
  cleanedName = cleanedName.replace(stopPunctuation, '').trim();
  // Step 4: Check if the length is 10 characters or less, and return if true
  if (cleanedName.length <= maxLength) {
    return cleanedName;
  }
  // Step 5: Remove stop words
  const stopWords = [
    'a',
    'an',
    'the',
    'of',
    'in',
    'on',
    'and',
    'for',
    'to',
    'by',
    'with',
    'at',
    'from',
  ];
  cleanedName = cleanedName
    .split(' ') // Split the string into words
    .filter(word => !stopWords.includes(word.toLowerCase())) // Remove stop words
    .join(' '); // Join the remaining words
  // Step 6: Check length after removing stop words, and return if 10 chars or less
  if (cleanedName.length <= maxLength) {
    return cleanedName;
  }
  // Step 7: Remove all spaces
  cleanedName = cleanedName.replace(/\s+/g, '');
  // Step 8: Check length after removing spaces, and return if 10 chars or less
  if (cleanedName.length <= maxLength) {
    return cleanedName;
  }
  return cleanedName.slice(0, maxLength);
}

////////////////////////////////////////////////////////////////////////////////

export function updateGenreInRepertoire(repertoire) {
  return repertoire.map(item => {
    const updatedContent = item.content
      .split('\n')
      .map(line => {
        if (line.toLowerCase().startsWith('# genre:')) {
          return '# genre: User';
        }
        return line;
      })
      .join('\n');
    return {
      ...item,
      content: updatedContent,
    };
  });
}

////////////////////////////////////////////////////////////////////////////////

export function truncatePathToFit(path, containerWidth) {
  if (!path || !containerWidth) return '';
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'nowrap';
  document.body.appendChild(span);
  let currentPath = path;
  let truncatedPath = currentPath;
  while (currentPath.length > 0) {
    span.textContent = currentPath;
    if (span.offsetWidth <= containerWidth) {
      truncatedPath = currentPath;
      break;
    }
    currentPath = currentPath.slice(1);
  }
  document.body.removeChild(span);
  return truncatedPath;
}

////////////////////////////////////////////////////////////////////////////////

export function isValidFolderName(name) {
  if (!name || name.trim() === '') return false;
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  return !invalidChars.test(name);
}

////////////////////////////////////////////////////////////////////////////////
