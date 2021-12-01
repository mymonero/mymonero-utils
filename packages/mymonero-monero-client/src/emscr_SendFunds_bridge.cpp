//
//  emscr_async_bridge_index.cpp
//  Copyright (c) 2014-2021, MyMonero.com
//
//  All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without modification, are
//  permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
//  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
//  MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
//  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
//  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
//  STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
//  THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//
//
#include "emscr_SendFunds_bridge.hpp"
//
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/foreach.hpp>
#include <emscripten.h>
#include <unordered_map>
#include <memory>
//
#include "string_tools.h"
#include "wallet_errors.h"
//
#include "serial_bridge_utils.hpp"
#include "SendFundsFormSubmissionController.hpp"
//
//
using namespace std;
using namespace boost;
using namespace SendFunds;
//
using namespace serial_bridge_utils;
using namespace monero_send_routine;
using namespace monero_transfer_utils;
using namespace emscr_SendFunds_bridge;
//
// Runtime - Memory
//
SendFunds::FormSubmissionController *controller_ptr = NULL;

//
// From-JS function decls
string emscr_SendFunds_bridge::send_funds(const string &args_string)
{
	boost::property_tree::ptree json_root;

	std::istringstream ss(args_string);
	boost::property_tree::read_json(ss, json_root);

	return (*controller_ptr).handle(json_root);
}

string emscr_SendFunds_bridge::prepare_send(const string &args_string)
{
	boost::property_tree::ptree json_root;

	std::istringstream ss(args_string);
	boost::property_tree::read_json(ss, json_root);
	
	if (json_root.get_child_optional("manuallyEnteredPaymentID")) {
 		return error_ret_json_from_message("Long payment IDs are obsolete.");
 	}
	
	const auto& destinations = json_root.get_child("destinations");
 	vector<string> dest_addrs, dest_amounts;
 	dest_addrs.reserve(destinations.size());
 	dest_amounts.reserve(destinations.size());

 	for (const auto& dest : destinations) {
 		dest_addrs.emplace_back(dest.second.get<string>("to_address"));
 		dest_amounts.emplace_back(dest.second.get<string>("send_amount"));
 	}

	Parameters parameters{
		std::move(dest_amounts),
		json_root.get<bool>("is_sweeping"),
		(uint32_t)stoul(json_root.get<string>("priority")),
		//
		nettype_from_string(json_root.get<string>("nettype_string")),
		json_root.get<string>("from_address_string"),
		json_root.get<string>("sec_viewKey_string"),
		json_root.get<string>("sec_spendKey_string"),
		json_root.get<string>("pub_spendKey_string"),
		//
		std::move(dest_addrs),
		//
		json_root.get_child("unspentOuts")
	};
	controller_ptr = new FormSubmissionController{parameters}; // heap alloc
	if (!controller_ptr) { // exception will be thrown if oom but JIC, since null ptrs are somehow legal in WASM
		return error_ret_json_from_message("Out of memory (heap vals container)");
	}
	
	return (*controller_ptr).prepare();
}
