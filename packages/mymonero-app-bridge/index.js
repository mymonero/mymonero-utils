const MyMoneroLibAppBridgeClass = require('./MyMoneroLibAppBridgeClass')
const MyMoneroBridge_utils = require('@mymonero/mymonero-bridge-utils')
const path = require('path');

//
// This function is copied here for now so that the parent directory / path discovery stuff happens from the right directory - in the future it may be worthwhile to generalize it so that it can work from any directory
module.exports = function(options)
{
	options = options || {}

	MyMoneroBridge_utils.update_options_for_fallback_to_asmjs(options)

	const platform_info = MyMoneroBridge_utils.detect_platform();
	const ENVIRONMENT_IS_WEB = platform_info.ENVIRONMENT_IS_WEB;
	const ENVIRONMENT_IS_NODE = platform_info.ENVIRONMENT_IS_NODE;
	
	function locateFile(filename, scriptDirectory)
	{
		// if (options["locateFile"]) {
		// 	return options["locateFile"](filename, scriptDirectory)
		// }
		var this_scriptDirectory = scriptDirectory
		const lastChar = this_scriptDirectory.charAt(this_scriptDirectory.length - 1)
		if (lastChar == "/" || lastChar == "\\") { 
			// ^-- this is not a '\\' on Windows because emscripten actually appends a '/'
			this_scriptDirectory = this_scriptDirectory.substring(0, this_scriptDirectory.length - 1) // remove trailing "/"
		}
		var fullPath = null; // add trailing slash to this
		if (ENVIRONMENT_IS_NODE) {
				fullPath = path.format({
					dir: this_scriptDirectory,
					base: filename
				})
		} else if (ENVIRONMENT_IS_WEB) {
			var pathTo_cryptonoteUtilsDir;
			if (typeof __dirname !== undefined && __dirname !== "/") { // looks like node running in browser.. (but not going to assume it's electron-renderer since that should be taken care of by monero_utils.js itself)
				// but just in case it is... here's an attempt to support it
				// have to check != "/" b/c webpack (I think) replaces __dirname
				pathTo_cryptonoteUtilsDir = "file://" + __dirname + "/" // prepending "file://" because it's going to try to stream it
			} else { // actual web browser
				pathTo_cryptonoteUtilsDir = `/assets/` // this works for the MyMonero browser build, and is quite general, at least
			}
			fullPath = pathTo_cryptonoteUtilsDir + filename
		}
		if (fullPath == null) {
			throw "Unable to derive fullPath. Please pass locateFile() to bridge obj init."
		}
		//
		return fullPath
	}
	return new Promise(function(resolve, reject) {
		var Module_template = {}
		
			console.log("Using wasm: ", true)
			Module_template["locateFile"] = locateFile
			//
			// NOTE: This requires src/module-post.js to be included as post-js in CMakeLists.txt under a wasm build
			require(`./MyMoneroLibAppCpp_WASM`)(Module_template).ready.then(function(thisModule) 
			{
				const instance = new MyMoneroLibAppBridgeClass(thisModule);
				resolve(instance);
			}).catch(function(e) {
				console.error("Error loading WASM_MyMoneroLibAppCpp:", e);
				reject(e);
			});
		
	});
}