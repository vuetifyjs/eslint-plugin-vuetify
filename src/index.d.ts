/// <reference path="./eslint-typegen.d.ts" />
import type { Linter } from 'eslint'

declare const vuetify: {
  configs: {
    base: Linter.LegacyConfig
    recommended: Linter.LegacyConfig
    'recommended-v4': Linter.LegacyConfig

    'flat/base': Linter.FlatConfig[]
    'flat/recommended': Linter.FlatConfig[]
    'flat/recommended-v4': Linter.FlatConfig[]

    tailwindcss: Linter.LegacyConfig
    'flat/tailwindcss': Linter.FlatConfig[]
  }
  rules: Record<string, any>
}

export = vuetify
