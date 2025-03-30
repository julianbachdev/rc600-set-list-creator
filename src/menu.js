import { app } from 'electron';

export const menuTemplate = [
  process.platform === 'darwin'
    ? {
        label: app.name,
        submenu: [{ role: 'quit' }],
      }
    : {},
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
    ],
  },
  {
    label: 'Window',
    submenu: [{ role: 'minimize' }, { role: 'togglefullscreen' }],
  },
];
