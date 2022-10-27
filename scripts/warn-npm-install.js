const fs = require('fs')

const reset = '\x1b[0m'
const red = '\x1b[31m'
const bright = '\x1b[1m'

if (fs.existsSync('package-lock.json') || fs.existsSync('yarn.lock')) {
  console.log()
  console.log(`${red}WARNING:${reset}`)
  console.log(`This project uses ${bright}PNPM${reset}. Installing its dependencies with ${bright}npm${reset} or ${bright}yarn${reset} may result in errors`)
  console.log(`Please remove ${bright}package-lock.json${reset} and ${bright}yarn.lock${reset} and try again, with PNPM this time`)
  console.log(`See ${bright}https://pnpm.io/${reset}`)
  console.log()
  process.exit(1)
}
