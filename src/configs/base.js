'use strict'

module.exports = {
  plugins: [
    'vuetify',
  ],
  rules: {
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],

    'vuetify/no-deprecated-components': 'error',
    'vuetify/no-deprecated-props': 'error',
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/no-deprecated-colors': 'error',
  },
}
