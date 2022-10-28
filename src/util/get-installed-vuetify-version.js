const { createRequire } = require('module')
const path = require('path')

function getInstalledVuetifyVersion () {
  try {
    const installedVuetify = createRequire(path.resolve(process.cwd(), 'package.json'))('vuetify/package.json')
    return installedVuetify.version
  } catch (e) {}
}

module.exports = {
  getInstalledVuetifyVersion,
}
