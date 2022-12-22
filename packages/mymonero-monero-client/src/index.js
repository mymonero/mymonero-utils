const WABridge = require('./WABridge')

module.exports = async function () {
  const thisModule = await require('./MyMoneroClient_WASM.js')({})
  return new WABridge(thisModule)
}
