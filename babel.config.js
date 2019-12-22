module.exports = (api) => ({
  test: {
    presets: [
      ['@babel/preset-env', { targets: { node: '12' } }],
      'power-assert',
    ],
    plugins: [
      'istanbul',
    ],
  },
  development: {
    presets: [
      ['@babel/preset-env', { targets: { node: '12' } }],
    ]
  },
})[api.env()]
