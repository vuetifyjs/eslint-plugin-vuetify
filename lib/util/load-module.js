'use strict'

const Module = require('module')
const originalLoader = Module._load

/**
 * Require a module, ignoring files that node can't process
 * @param {string} id
 * @returns {any}
 */
module.exports = function loadModule (id) {
  Module._load = function _load (request, parent) {
    if (
      !request.endsWith('.sass') &&
      !request.endsWith('.scss')
    ) return originalLoader(request, parent)
  }
  const module = require(id)
  Module._load = originalLoader

  return module
}
