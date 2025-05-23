export const rhythmSettingsDefault = {
  bpm: 120,
  genre: 'USER',
  key: 'C',
  keyTrue: '',
  kit: 'BRUSH',
  loop: '',
  name: '',
  pattern: '__4A_',
  rhythm: 'OFF',
  timeSignature: '2/4',
  variation: 'A',
};

export const rhythmMenuData = [
  {
    value: -1,
    variation: [
      { name: 'A', value: 0 },
      { name: 'B', value: 1 },
      { name: 'C', value: 2 },
      { name: 'D', value: 3 },
    ],
    kit: [
      { name: 'STUDIO', value: 0 },
      { name: 'LIVE', value: 1 },
      { name: 'LIGHT', value: 2 },
      { name: 'HEAVY', value: 3 },
      { name: 'ROCK', value: 4 },
      { name: 'METAL', value: 5 },
      { name: 'JAZZ', value: 6 },
      { name: 'BRUSH', value: 7 },
      { name: 'CAJON', value: 8 },
      { name: 'DRUM & BASS', value: 9 },
      { name: 'R & B', value: 10 },
      { name: 'DANCE', value: 11 },
      { name: 'TECHNO', value: 12 },
      { name: 'DANCE BEATS', value: 13 },
      { name: 'HIP HOP', value: 14 },
      { name: '808 + 909', value: 15 },
    ],
  },
  {
    timeSignature: '2/4',
    value: 0,
    genre: [
      { name: 'TRAD', value: 15, pattern: [{ name: 'TRAIN2', value: 2 }] },
      { name: 'BALLRM', value: 17, pattern: [{ name: 'CUMBIA', value: 1 }] },
      {
        name: 'GUIDE',
        value: 19,
        pattern: [
          { name: '2/4', value: 0 },
          { name: '2/4 TRIPLE', value: 1 },
        ],
      },
      {
        name: 'USER',
        value: 20,
        pattern: [
          { name: '__2A_', value: 0 },
          { name: '__2B_', value: 1 },
          { name: '__2AS', value: 2 },
          { name: '__2BS', value: 3 },
          { name: '__2SWING_', value: 4 },
          { name: '__4A_', value: 5 },
          { name: '__4B_', value: 6 },
          { name: '__4BACHATA_', value: 7 },
          { name: '__4BOSSA_', value: 8 },
          { name: '__4SALSA_', value: 9 },
          { name: '__6A_', value: 10 },
          { name: '__6B_', value: 11 },
          { name: '__8A_', value: 12 },
          { name: '__8B_', value: 13 },
        ],
      },
    ],
  },
  {
    timeSignature: '3/4',
    value: 1,
    genre: [
      { name: 'BALLAD', value: 1, pattern: [{ name: 'SHUFFLE2', value: 5 }] },
      { name: 'BLUES', value: 2, pattern: [{ name: '3BEAT', value: 4 }] },
      {
        name: 'BALLRM',
        value: 17,
        pattern: [
          { name: 'WALTZ1', value: 8 },
          { name: 'WALTZ2', value: 9 },
        ],
      },
      {
        name: 'GUIDE',
        value: 19,
        pattern: [
          { name: '3/4', value: 2 },
          { name: '3/4 TRIPLE', value: 3 },
        ],
      },
      {
        name: 'USER',
        value: 20,
        pattern: [
          { name: '__3A_', value: 14 },
          { name: '__3B_', value: 15 },
        ],
      },
    ],
  },
  {
    timeSignature: '4/4',
    value: 2,
    genre: [
      {
        name: 'ACOUSTIC',
        value: 0,
        pattern: [
          { name: 'SIDE STICK', value: 0 },
          { name: 'BOSSA', value: 1 },
          { name: 'BRUSH1', value: 2 },
          { name: 'BRUSH2', value: 3 },
          { name: 'CONGA 8BEAT', value: 4 },
          { name: 'CONGA 16BEAT', value: 5 },
          { name: 'CONGA 4BEAT', value: 6 },
          { name: 'CONGA SWING', value: 7 },
          { name: 'CONGA BOSSA', value: 8 },
          { name: 'CAJON1', value: 9 },
          { name: 'CAJON2', value: 10 },
        ],
      },
      {
        name: 'BALLAD',
        value: 1,
        pattern: [
          { name: 'SIDE STICK1', value: 0 },
          { name: 'SIDE STICK2', value: 1 },
          { name: 'SIDE STICK3', value: 2 },
          { name: 'SIDE STICK4', value: 3 },
          { name: 'SHUFFLE1', value: 4 },
          { name: '8BEAT', value: 6 }, // 5 Skipped on hardware
          { name: '16BEAT1', value: 7 },
          { name: '16BEAT2', value: 8 },
          { name: 'SWING', value: 9 },
        ],
      },
      {
        name: 'BLUES',
        value: 2,
        pattern: [
          { name: '12BARS', value: 0 },
          { name: 'SHUFFLE1', value: 1 },
          { name: 'SHUFFLE2', value: 2 },
          { name: 'SWING', value: 5 }, // 3 & 4 Skipped on hardware
        ],
      },
      {
        name: 'JAZZ',
        value: 3,
        pattern: [
          { name: 'JAZZ BLUES', value: 0 },
          { name: 'FAST 4BEAT', value: 1 },
          { name: 'HARD BOP', value: 2 },
          { name: 'BRUSH BOP', value: 3 },
          { name: 'BRUSH SWING', value: 4 },
          { name: 'FAST SWING', value: 5 },
          { name: 'MED SWING', value: 6 },
          { name: 'SLOW LEGATO', value: 7 },
          { name: 'JAZZ SAMBA', value: 8 },
        ],
      },
      {
        name: 'FUSION',
        value: 4,
        pattern: [
          { name: '16BEAT1', value: 0 },
          { name: '16BEAT2', value: 1 },
          { name: '16BEAT3', value: 2 },
          { name: '16BEAT4', value: 3 },
          { name: '16BEAT5', value: 4 },
          { name: '16BEAT6', value: 5 },
          { name: '16BEAT7', value: 6 },
          { name: 'SWING', value: 7 },
        ],
      },
      {
        name: 'R&B',
        value: 5,
        pattern: [
          { name: 'SWING1', value: 0 },
          { name: 'SWING2', value: 1 },
          { name: 'SWING3', value: 2 },
          { name: 'SIDE STICK1', value: 3 },
          { name: 'SIDE STICK2', value: 4 },
          { name: 'SIDE STICK3', value: 5 },
          { name: 'SHUFFLE1', value: 6 },
          { name: 'SHUFFLE2', value: 7 },
          { name: '8BEAT1', value: 8 },
          { name: '16BEAT', value: 9 },
        ],
      },
      {
        name: 'SOUL',
        value: 6,
        pattern: [
          { name: 'SWING1', value: 0 },
          { name: 'SWING2', value: 1 },
          { name: 'SWING3', value: 2 },
          { name: 'SWING4', value: 3 },
          { name: '16BEAT1', value: 4 },
          { name: '16BEAT2', value: 5 },
          { name: '16BEAT3', value: 6 },
          { name: 'SIDE STICK1', value: 7 },
          { name: 'SIDE STICK2', value: 8 },
          { name: 'MOTOWN', value: 9 },
          { name: 'PERCUS', value: 10 },
        ],
      },
      {
        name: 'FUNK',
        value: 7,
        pattern: [
          { name: '8BEAT1', value: 0 },
          { name: '8BEAT2', value: 1 },
          { name: '8BEAT3', value: 2 },
          { name: '8BEAT4', value: 3 },
          { name: '16BEAT1', value: 4 },
          { name: '16BEAT2', value: 5 },
          { name: '16BEAT3', value: 6 },
          { name: '16BEAT4', value: 7 },
          { name: 'SWING1', value: 8 },
          { name: 'SWING2', value: 9 },
          { name: 'SWING3', value: 10 },
        ],
      },
      {
        name: 'POP',
        value: 8,
        pattern: [
          { name: '8BEAT1', value: 0 },
          { name: '8BEAT2', value: 1 },
          { name: '16BEAT1', value: 2 },
          { name: '16BEAT2', value: 3 },
          { name: 'PERCUS1', value: 4 },
          { name: 'SHUFFLE1', value: 6 }, // 5 Skipped on hardware
          { name: 'SHUFFLE2', value: 7 },
          { name: 'SIDE STICK1', value: 8 },
          { name: 'SIDE STICK2', value: 9 },
          { name: 'SWING1', value: 10 },
          { name: 'SWING2', value: 11 },
        ],
      },
      {
        name: 'SOFT ROCK',
        value: 9,
        pattern: [
          { name: '16BEAT1', value: 0 },
          { name: '16BEAT2', value: 1 },
          { name: '16BEAT3', value: 2 },
          { name: '16BEAT4', value: 3 },
          { name: '8BEAT', value: 4 },
          { name: 'SWING1', value: 5 },
          { name: 'SWING2', value: 6 },
          { name: 'SWING3', value: 7 },
          { name: 'SWING4', value: 8 },
          { name: 'SIDE STICK1', value: 9 },
          { name: 'SIDE STICK2', value: 10 },
          { name: 'PERCUS1', value: 11 },
          { name: 'PERCUS2', value: 12 },
        ],
      },
      {
        name: 'ROCK',
        value: 10,
        pattern: [
          { name: '8BEAT1', value: 0 },
          { name: '8BEAT2', value: 1 },
          { name: '8BEAT3', value: 2 },
          { name: '8BEAT4', value: 3 },
          { name: '8BEAT5', value: 4 },
          { name: '8BEAT6', value: 5 },
          { name: '16BEAT1', value: 6 },
          { name: '16BEAT2', value: 7 },
          { name: '16BEAT3', value: 8 },
          { name: '16BEAT4', value: 9 },
          { name: 'SHUFFLE1', value: 10 },
          { name: 'SHUFFLE2', value: 11 },
          { name: 'SWING1', value: 12 },
          { name: 'SWING2', value: 13 },
          { name: 'SWING3', value: 14 },
          { name: 'SWING4', value: 15 },
        ],
      },
      {
        name: 'ALT ROCK',
        value: 11,
        pattern: [
          { name: 'RIDE BEAT', value: 0 },
          { name: '8BEAT1', value: 1 },
          { name: '8BEAT2', value: 2 },
          { name: '8BEAT3', value: 3 },
          { name: '8BEAT4', value: 4 },
          { name: '16BEAT1', value: 5 },
          { name: '16BEAT2', value: 6 },
          { name: '16BEAT3', value: 7 },
          { name: '16BEAT4', value: 8 },
          { name: 'SWING', value: 9 },
        ],
      },
      {
        name: 'PUNK',
        value: 12,
        pattern: [
          { name: '8BEAT1', value: 0 },
          { name: '8BEAT2', value: 1 },
          { name: '8BEAT3', value: 2 },
          { name: '8BEAT4', value: 3 },
          { name: '8BEAT5', value: 4 },
          { name: '8BEAT6', value: 5 },
          { name: '16BEAT1', value: 6 },
          { name: '16BEAT2', value: 7 },
          { name: '16BEAT3', value: 8 },
          { name: 'SIDE STICK1', value: 9 },
          // { name: '8BEAT6', value: 10 }, // DUPLICATE INCLUDED IN HARDWARE
        ],
      },
      {
        name: 'HEAVY ROCK',
        value: 13,
        pattern: [
          { name: '8BEAT1', value: 0 },
          { name: '8BEAT2', value: 1 },
          { name: '8BEAT3', value: 2 },
          { name: '16BEAT1', value: 3 },
          { name: '16BEAT2', value: 4 },
          { name: '16BEAT3', value: 5 },
          { name: 'SHUFFLE1', value: 6 },
          { name: 'SHUFFLE2', value: 7 },
          { name: 'SWING1', value: 8 },
          { name: 'SWING2', value: 9 },
          { name: 'SWING3', value: 10 },
        ],
      },
      {
        name: 'METAL',
        value: 14,
        pattern: [
          { name: '8BEAT1', value: 0 },
          { name: '8BEAT2', value: 1 },
          { name: '8BEAT3', value: 2 },
          { name: '8BEAT4', value: 3 },
          { name: '8BEAT5', value: 4 },
          { name: '8BEAT6', value: 5 },
          { name: '2XBD1', value: 6 },
          { name: '2XBD2', value: 7 },
          { name: '2XBD3', value: 8 },
          { name: '2XBD4', value: 9 },
          { name: '2XBD5', value: 10 },
        ],
      },
      {
        name: 'TRAD',
        value: 15,
        pattern: [
          { name: 'ROCKNROLL', value: 0 },
          { name: 'TRAIN1', value: 1 },
          { name: 'COUNTRY1', value: 3 }, // 2 Skipped on hardware
          { name: 'COUNTRY2', value: 4 },
          { name: 'COUNTRY3', value: 5 },
          { name: 'FOXTROT', value: 6 },
          { name: 'TRAD1', value: 7 },
          { name: 'TRAD2', value: 8 },
        ],
      },
      {
        name: 'WORLD',
        value: 16,
        pattern: [
          { name: 'BOSSA1', value: 0 },
          { name: 'BOSSA2', value: 1 },
          { name: 'SAMBA1', value: 2 },
          { name: 'SAMBA2', value: 3 },
          { name: 'BOOGALOO', value: 4 },
          { name: 'MERENGUE', value: 5 },
          { name: 'REGGAE', value: 6 },
          { name: 'LATIN ROCK1', value: 7 },
          { name: 'LATIN ROCK2', value: 8 },
          { name: 'LATIN PERC', value: 9 },
          { name: 'SURDO', value: 10 },
          { name: 'LATIN1', value: 11 },
          { name: 'LATIN2', value: 12 },
        ],
      },
      {
        name: 'BALLRM',
        value: 17,
        pattern: [
          { name: 'CHACHA', value: 0 },
          { name: 'BENGUINE', value: 1 },
          { name: 'RHUMBA', value: 3 }, // 2 Skipped on hardware
          { name: 'TANGO1', value: 4 },
          { name: 'TANGO2', value: 5 },
          { name: 'JIVE', value: 6 },
          { name: 'CHARLSTON', value: 7 },
        ],
      },
      {
        name: 'ELCTRO',
        value: 18,
        pattern: [
          { name: 'ELCTRO1', value: 0 },
          { name: 'ELCTRO2', value: 1 },
          { name: 'ELCTRO3', value: 2 },
          { name: 'ELCTRO4', value: 3 },
          { name: 'ELCTRO5', value: 4 },
          { name: 'ELCTRO6', value: 5 },
          { name: 'ELCTRO7', value: 6 },
          { name: 'ELCTRO8', value: 7 },
        ],
      },
      {
        name: 'GUIDE',
        value: 19,
        pattern: [
          { name: '4/4', value: 4 }, // 21 Skipped on hardware
          { name: '4/4 TRIPLE', value: 5 }, // 22 Skipped on hardware
          { name: 'BD 8BEAT', value: 23 },
          { name: 'BD 16BEAT', value: 24 },
          { name: 'BD SHUFFLE', value: 25 },
          { name: 'HH 8BEAT', value: 26 },
          { name: 'HH 16BEAT', value: 27 },
          { name: 'HH SWING1', value: 28 },
          { name: 'HH SWING2', value: 29 },
          { name: '8BEAT1', value: 30 },
          { name: '8BEAT2', value: 31 },
          { name: '8BEAT3', value: 32 },
          { name: '8BEAT4', value: 33 },
        ],
      },
      {
        name: 'USER',
        value: 20,
        pattern: [
          { name: '__2A_', value: 16 },
          { name: '__2B_', value: 17 },
          { name: '__2AS', value: 18 },
          { name: '__2BS', value: 19 },
          { name: '__2SWING_', value: 20 },
          { name: '__4A_', value: 21 },
          { name: '__4B_', value: 22 },
          { name: '__4BACHATA_', value: 23 },
          { name: '__4BOSSA_', value: 24 },
          { name: '__4SALSA_', value: 25 },
          { name: '__6A_', value: 26 },
          { name: '__6B_', value: 27 },
          { name: '__8A_', value: 28 },
          { name: '__8B_', value: 29 },
        ],
      },
    ],
  },
  {
    timeSignature: '5/4',
    value: 3,
    genre: [
      { name: 'ALT ROCK', value: 11, pattern: [{ name: '5/4 BEAT', value: 10 }] },
      { name: 'ELCTRO', value: 18, pattern: [{ name: '5/4 BEAT', value: 8 }] },
      {
        name: 'GUIDE',
        value: 19,
        pattern: [
          { name: '5/4', value: 6 },
          { name: '5/4 TRIPLE', value: 7 },
        ],
      },
    ],
  },
  {
    timeSignature: '6/4',
    value: 4,
    genre: [
      {
        name: 'GUIDE',
        value: 19,
        pattern: [
          { name: '6/4', value: 8 },
          { name: '6/4 TRIPLE', value: 9 },
        ],
      },
    ],
  },
  {
    timeSignature: '7/4',
    value: 5,
    genre: [
      {
        name: 'GUIDE',
        value: 19,
        pattern: [
          { name: '7/4', value: 10 },
          { name: '7/4 TRIPLE', value: 11 },
        ],
      },
    ],
  },
  {
    timeSignature: '5/8',
    value: 6,
    genre: [
      { name: 'GUIDE', value: 19, pattern: [{ name: '5/8', value: 12 }] },
      {
        name: 'USER',
        value: 20,
        pattern: [
          { name: '__5A_', value: 30 },
          { name: '__5B_', value: 31 },
        ],
      },
    ],
  },
  {
    timeSignature: '6/8',
    value: 7,
    genre: [
      { name: 'BALLAD', value: 1, pattern: [{ name: '6/8 BEAT', value: 10 }] },
      { name: 'BLUES', value: 2, pattern: [{ name: '6/8 BEAT', value: 3 }] },
      { name: 'JAZZ', value: 3, pattern: [{ name: '6/8 BEAT', value: 9 }] },
      { name: 'POP', value: 8, pattern: [{ name: 'PERCUS2', value: 5 }] },
      { name: 'GUIDE', value: 19, pattern: [{ name: '6/8', value: 13 }] },
    ],
  },
  {
    timeSignature: '7/8',
    value: 8,
    genre: [
      { name: 'FUSION', value: 4, pattern: [{ name: '7/8 BEAT', value: 8 }] },
      { name: 'R&B', value: 5, pattern: [{ name: '7/8 BEAT', value: 10 }] },
      { name: 'GUIDE', value: 19, pattern: [{ name: '7/8', value: 14 }] },
      {
        name: 'USER',
        value: 20,
        pattern: [
          { name: '__7A_', value: 32 },
          { name: '__7B_', value: 33 },
        ],
      },
    ],
  },
  {
    timeSignature: '8/8',
    value: 9,
    genre: [{ name: 'GUIDE', value: 19, pattern: [{ name: '8/8', value: 15 }] }],
  },
  {
    timeSignature: '9/8',
    value: 10,
    genre: [
      { name: 'GUIDE', value: 19, pattern: [{ name: '9/8', value: 16 }] },
      {
        name: 'USER',
        value: 20,
        pattern: [
          { name: '__9A_', value: 34 },
          { name: '__9B_', value: 35 },
        ],
      },
    ],
  },
];
