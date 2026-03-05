import fs from 'node:fs'
import { createRequire } from 'node:module'
import { pluginsToRulesDTS } from 'eslint-typegen/core'

const require = createRequire(import.meta.url)
const plugin = require('../lib/index.js')

const dts = await pluginsToRulesDTS(
  { vuetify: plugin },
  { includeAugmentation: false }
)

fs.writeFileSync('lib/eslint-typegen.d.ts', dts)
console.log('Generated lib/eslint-typegen.d.ts')
