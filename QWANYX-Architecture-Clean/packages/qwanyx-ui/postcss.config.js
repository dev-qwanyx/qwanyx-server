module.exports = {
  plugins: {
    'postcss-import': {}, // This will inline @import statements
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
      }
    }
  }
}