module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/icons/icon',
    extraResource: [
      'src/data/xmlDataTemplate/RHYTHM.RC0',
      'src/data/xmlDataTemplate/SYSTEM1.RC0',
      'src/data/xmlDataTemplate/0_0/000000000A.RC0',
      'src/data/xmlDataTemplate/2_4/222222222A.RC0',
      'src/data/xmlDataTemplate/2_4/222_2.WAV',
      'src/data/xmlDataTemplate/3_4/333333333A.RC0',
      'src/data/xmlDataTemplate/3_4/333_3.WAV',
      'src/data/xmlDataTemplate/4_4/444444444A.RC0',
      'src/data/xmlDataTemplate/4_4/444_4.WAV',
      'src/data/xmlDataTemplate/5_8/555555555A.RC0',
      'src/data/xmlDataTemplate/5_8/555_5.WAV',
      'src/data/xmlDataTemplate/7_8/777777777A.RC0',
      'src/data/xmlDataTemplate/7_8/777_7.WAV',
      'src/data/xmlDataTemplate/9_8/999999999A.RC0',
      'src/data/xmlDataTemplate/9_8/999_9.WAV',
    ],
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
