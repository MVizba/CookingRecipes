import { exec } from 'child_process'

const [command, migrationPath, migrationName] = process.argv.slice(2)

// using a custom script to run typeorm cli to address 2 issues:
// 1. it's tedious to pass src/database/migrations as a path to typeorm cli
// 2. using bash -c in script tags does not work on Windows without WSL
const script = `npm run typeorm ${command} ${migrationPath.replace('@0', migrationName)}`

const child = exec(script, (error) => {
  if (error) {
    process.stderr.write(error.message)
  }
})

const pipeTo = (stream) => (message) => {
  stream.write(message)
}

child.stdout.on('data', pipeTo(process.stdout))
child.stderr.on('data', pipeTo(process.stderr))
child.on('exit', process.exit)
