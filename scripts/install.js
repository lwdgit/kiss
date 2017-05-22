const {
    execSync,
    exec
} = require('child_process')
const fs = require('fs')
const co = require('co')

const runner = function (command) {
  return new Promise((resolve, reject) => {
    if (!command) return
    let proc = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(null, stdout)
    })
    proc.stdout.on('data', data => {
      process.stdout.write(data)
    })
    proc.stderr.on('data', err => {
      process.stdout.write(err)
      reject(err)
    })
  })
}

function * install () {
  if (~execSync('which bundler').toString().indexOf('not found')) {
    yield runner('gem install bundler')
  }
  if (!fs.existsSync('Gemfile.lock')) {
    yield runner('bundler install')
  }
}

co(install).then(function (done) {
  console.log('√ Done')
}).catch(function (e) {
  console.error(e)
})
