module.exports = {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
    jest: {
      "preset": "ts-jest",
      "testEnvironment": "node",
      "transform": {
        "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
      },
      "transformIgnorePatterns": [
        "node_modules/(?!variables/.*)"
      ]
    },
  };