module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/icons/icon',
    extraResource: ['src/data/xmlDataTemplate'],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'rc600_set_list_master',
        iconUrl: 'src/assets/icons/icon.ico',
        setupIcon: 'src/assets/icons/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: 'src/assets/icons/icon.icns',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: 'src/assets/icons/icon.png',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: 'src/assets/icons/icon.png',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};
