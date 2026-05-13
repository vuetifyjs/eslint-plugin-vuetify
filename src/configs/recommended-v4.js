const { md3 } = require('../rules/no-deprecated-typography')

module.exports = {
  rules: {
    'vuetify/no-deprecated-snackbar': 'error',
    'vuetify/no-deprecated-typography': ['error', md3],
    'vuetify/no-elevation-overflow': 'error',
    'vuetify/no-legacy-grid-props': 'error',
  },
}
