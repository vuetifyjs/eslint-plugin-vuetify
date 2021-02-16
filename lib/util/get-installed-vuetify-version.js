const Module = require('module')
const path = require('path')

// https://github.com/benmosher/eslint-plugin-import/pull/1591
// https://github.com/benmosher/eslint-plugin-import/pull/1602
// Polyfill Node's `Module.createRequireFromPath` if not present (added in Node v10.12.0)
// Use `Module.createRequire` if available (added in Node v12.2.0)
// eslint-disable-next-line node/no-deprecated-api
const createRequire = Module.createRequire || Module.createRequireFromPath || function (filename) {
  const mod = new Module(filename, null)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))

  mod._compile(`module.exports = require;`, filename)

  return mod.exports
}

function getInstalledVuetifyVersion () {
  try {
    const installedVuetify = createRequire(path.resolve(process.cwd(), 'package.json'))('vuetify/package.json')
    return installedVuetify.version
  } catch (e) {}
}

module.exports = {
  getInstalledVuetifyVersion
}
