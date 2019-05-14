const path = require('path')

const updater = require('../index')

updater.config({
  root: __dirname,
  versionURL: 'http://fimoapp.com/hub/index.json',
  versionField: 'version',
  zipURL: 'http://fimoapp.com/hub/',
  packageJsonFile: path.resolve(__dirname, './test.json'),
  nowVersion: '1.0.0'
})

updater.check().then(({ version, isNeedUpdate }) => {
  if (isNeedUpdate) {
    updater.update().then(() => {
      console.log('>>>>>>>>>>>>>>>> update success')
    })
  }
})

updater.updating((msg, progress) => {
  console.log(msg, progress)
})
