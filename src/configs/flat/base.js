module.exports = [
  {
    plugins: {
      vue: require('eslint-plugin-vue'),
      get vuetify () {
        return require('../../index')
      },
    },
    rules: require('../base').rules,
  },
]
