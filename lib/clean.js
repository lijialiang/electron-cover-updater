const path = require('path')
const del = require('del')

module.exports = function ({ zip }) {
  return new Promise((resolve, reject) => {
    const { updating, option: { root } } = this

    try {
      del.sync([zip, path.resolve(root, './__MACOSX')])

      updating('clean up success')

      resolve()
    } catch (err) {
      console.log('[UPDATER]', err)
      /* eslint-disable */
      reject('clean fail')
    }
  })
}
