
function ret_val_boolstring_to_bool(boolstring)
{
	if (typeof boolstring !== "string") {
		throw "ret_val_boolstring_to_bool expected string input"
	}
	if (boolstring === "true" || boolstring === "1") {
		return true
	} else if (boolstring === "false" || boolstring === "0") {
		return false
	}
	throw "ret_val_boolstring_to_bool given illegal input"
}
exports.ret_val_boolstring_to_bool = ret_val_boolstring_to_bool;
//
function api_safe_wordset_name(wordset_name)
{
	// convert all lowercase, legacy values to core-cpp compatible
	if (wordset_name == "english") {
		return "English"
	} else if (wordset_name == "spanish") {
		return "Español"
	} else if (wordset_name == "portuguese") {
		return "Português"
	} else if (wordset_name == "japanese") {
		return "日本語"
	}
	return wordset_name // must be a value returned by core-cpp
}
exports.api_safe_wordset_name = api_safe_wordset_name;
//
function detect_platform()
{
	const ENVIRONMENT_IS_WEB = typeof window==="object";
	const ENVIRONMENT_IS_WORKER = typeof importScripts==="function";
	const ENVIRONMENT_IS_NODE = typeof process==="object" && process.browser !== true && typeof require==="function" && ENVIRONMENT_IS_WORKER == false; // we want this to be true for Electron but not for a WebView
	const ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
	return {
		ENVIRONMENT_IS_WEB: ENVIRONMENT_IS_WEB,
		ENVIRONMENT_IS_WORKER: ENVIRONMENT_IS_WORKER,
		ENVIRONMENT_IS_NODE: ENVIRONMENT_IS_NODE,
		ENVIRONMENT_IS_SHELL: ENVIRONMENT_IS_SHELL
	}
}
exports.detect_platform = detect_platform;
//
function update_options_for_fallback_to_asmjs(options)
{
	const platform_info = detect_platform();
	const ENVIRONMENT_IS_WEB = platform_info.ENVIRONMENT_IS_WEB;
	if ((typeof options.asmjs === 'undefined' || options.asmjs === null) && (typeof options.wasm === 'undefined' || options.wasm === null)) {
		var use_asmjs = false;
		if (ENVIRONMENT_IS_WEB) {
			var hasWebAssembly = false
			try {
				if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
					const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
					if (module instanceof WebAssembly.Module) {
						var isInstance = new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
						if (isInstance) {
							// TODO: add ios 11 mobile safari bug check to hasWebAssembly
						}
						// until then…
						hasWebAssembly = isInstance
					}
				}
			} catch (e) {
				// avoiding empty block statement warning..
				hasWebAssembly = false // to be clear
			}
			use_asmjs = hasWebAssembly != true
		}
		options.asmjs = use_asmjs;
	}
}
exports.update_options_for_fallback_to_asmjs = update_options_for_fallback_to_asmjs;