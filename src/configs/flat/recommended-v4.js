module.exports = [
  ...require('./base'),
  {
    plugins: {
      get vuetify () {
        return require('../../index')
      },
    },
    rules: require('../recommended-v4').rules,
  },
]
