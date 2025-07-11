module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@screens': './screens',
            '@components': './components',
            '@services': './services',
            '@utils': './utils',
            '@config': './config',
          },
        },
      ],
    ],
  };
};