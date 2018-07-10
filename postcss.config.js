module.exports = {
  plugins: {
    'postcss-cssnext': {
      browsers: ['> 2%'],
      flexbox: 'no-2009'
    },
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
}
