// Original Author: Lucas Jones
// Modified to remove jQuery dep and support modular inclusion of deps by Paul Shapiro (2016)
// Modified to add RingCT support by luigi1111 (2017)
//
// v--- These should maybe be injected into a context and supplied to currencyConfig for future platforms
const MyMoneroBridge_utils = require('./MyMoneroBridge_utils')
//
class MyMoneroBridgeClass_Base
{
	constructor(this_Module)
	{
		this.Module = this_Module;
	}
	//
	//
	__new_cb_args_with(task_id, err_msg, res)
	{
		const args = 
		{
			task_id: task_id
		};
		if (typeof err_msg !== 'undefined' && err_msg) {
			args.err_msg = err_msg; // errors must be sent back so that C++ can free heap vals container
		} else {
			args.res = res;
		}
		return args;
	}
	__new_task_id()
	{
		return Math.random().toString(36).substr(2, 9); // doesn't have to be super random
	}
}
//
module.exports = MyMoneroBridgeClass_Base