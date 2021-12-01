//
//  SendFundsFormSubmissionController.cpp
//  MyMonero
//
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
#include "SendFundsFormSubmissionController.hpp"
#include <iostream>
#include "wallet_errors.h"
#include "monero_address_utils.hpp"
#include "monero_paymentID_utils.hpp"
#include "monero_send_routine.hpp"
#include "serial_bridge_utils.hpp"
using namespace monero_send_routine;
using namespace monero_transfer_utils;
using namespace SendFunds;
using namespace serial_bridge_utils;

#include <boost/optional/optional_io.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
using namespace boost;

string FormSubmissionController::handle(const property_tree::ptree res)
{
	this->randomOuts = res;
	
	const bool step2 = this->cb_II__got_random_outs(this->randomOuts);
	if (!step2) {
		return error_ret_json_from_message("couldnt use random outputs");
	}
	
	return this->cb_III__submitted_tx();
}

string FormSubmissionController::prepare()
{
	using namespace std;
	using namespace boost;
	
	this->sending_amounts.clear();
 	if (this->parameters.send_amount_strings.size() != this->parameters.enteredAddressValues.size()) {
 		return error_ret_json_from_message("Amounts don't match recipients.");
 	}
	
	if (this->parameters.is_sweeping) {
		if (this->parameters.enteredAddressValues.size() != 1) {
 			return error_ret_json_from_message("Only one recipient allowed when sweeping.");
 		}
	} else {
		this->sending_amounts.reserve(this->parameters.send_amount_strings.size());
 		for (const auto& amount : this->parameters.send_amount_strings) {
 			uint64_t parsed_amount;
 			if (!cryptonote::parse_amount(parsed_amount, amount)) {
 				return error_ret_json_from_message("Cannot parse amount.");
 			}
 			if (parsed_amount == 0) {
 				return error_ret_json_from_message("Amount cannot be zero.");
 			}
 			this->sending_amounts.push_back(parsed_amount);
		}
	}
		
	this->isXMRAddressIntegrated = false;
 	this->integratedAddressPIDForDisplay = boost::none;
 	this->to_address_strings.clear();
 	this->to_address_strings.reserve(this->parameters.enteredAddressValues.size());
 	for (string& xmrAddress_toDecode : this->parameters.enteredAddressValues) {
 		auto decode_retVals = monero::address_utils::decodedAddress(xmrAddress_toDecode, this->parameters.nettype);
 		if (decode_retVals.did_error) {
 			return error_ret_json_from_message("Invalid address");
 		}
 		this->to_address_strings.emplace_back(std::move(xmrAddress_toDecode));
		if (decode_retVals.paymentID_string != boost::none) { // is integrated address!
			if (this->isXMRAddressIntegrated) {
				return error_ret_json_from_message("Only one integrated address allowed per transaction");
			}

			this->isXMRAddressIntegrated = true;
			this->integratedAddressPIDForDisplay = *decode_retVals.paymentID_string;
		}
 	}

	if (this->isXMRAddressIntegrated) {
		// XXX: why does the integrated address case return early??
		boost::property_tree::ptree root;
		root.put("retVal", "true");
		return ret_json_from_root(root);
	}

	const bool step1 = this->cb_I__got_unspent_outs(this->parameters.unspentOuts);
	if (!step1) {
		return error_ret_json_from_message(this->failureReason);
	}

	const bool reenter = this->_reenterable_construct_and_send_tx();
	if (!reenter) {
		return error_ret_json_from_message(this->failureReason);
	}
	auto req_params = new__req_params__get_random_outs(this->step1_retVals__using_outs); // use the one on the heap, since we've moved the one from step1_retVals
	// this->randomOuts = this->get_random_outs(req_params);

	boost::property_tree::ptree req_params_root;
		boost::property_tree::ptree amounts_ptree;
		BOOST_FOREACH(const string &amount_string, req_params.amounts)
		{
			property_tree::ptree amount_child;
			amount_child.put("", amount_string);
			amounts_ptree.push_back(std::make_pair("", amount_child));
		}
		req_params_root.add_child("amounts", amounts_ptree);
		req_params_root.put("count", req_params.count);
		stringstream req_params_ss;
		boost::property_tree::write_json(req_params_ss, req_params_root, false/*pretty*/);
	
	return req_params_ss.str().c_str();
}

bool FormSubmissionController::cb_I__got_unspent_outs(const optional<property_tree::ptree> &res)
{
	crypto::secret_key sec_viewKey{};
	crypto::secret_key sec_spendKey{};
	crypto::public_key pub_spendKey{};
	{
		bool r = false;
		r = epee::string_tools::hex_to_pod(this->parameters.sec_viewKey_string, sec_viewKey);
		if (!r) {
			this->failureReason = "Invalid privateViewKey";
			return false;
		}
		r = epee::string_tools::hex_to_pod(this->parameters.sec_spendKey_string, sec_spendKey);
		if (!r) {
			this->failureReason = "Invalid privateSpendKey";
			return false;
		}
		r = epee::string_tools::hex_to_pod(this->parameters.pub_spendKey_string, pub_spendKey);
		if (!r) {
			this->failureReason = "Invalid publicSpendKey";
			return false;
		}
	}
	auto parsed_res = new__parsed_res__get_unspent_outs(
		res.get(),
		sec_viewKey,
		sec_spendKey,
		pub_spendKey
	);
	if (parsed_res.err_msg != boost::none) {
		this->failureReason = std::move(*(parsed_res.err_msg));
		return false;
	}
	this->unspent_outs = std::move(*(parsed_res.unspent_outs));
	this->fee_per_b = *(parsed_res.per_byte_fee);
	this->fee_mask = *(parsed_res.fee_mask);
	this->use_fork_rules = monero_fork_rules::make_use_fork_rules_fn(parsed_res.fork_version);
	//
	this->passedIn_attemptAt_fee = boost::none;
	this->constructionAttempt = 0;

	return true;
}
bool FormSubmissionController::_reenterable_construct_and_send_tx()
{
	Send_Step1_RetVals step1_retVals;
	monero_transfer_utils::send_step1__prepare_params_for_get_decoys(
		step1_retVals,
		//
		boost::none,
		this->sending_amounts,
		this->parameters.is_sweeping,
		this->parameters.priority,
		this->use_fork_rules,
		this->unspent_outs,
		this->fee_per_b,
		this->fee_mask,
		//
		this->passedIn_attemptAt_fee // use this for passing step2 "must-reconstruct" return values back in, i.e. re-entry; when none, defaults to attempt at network min
		// ^- and this will be 'none' as initial value
	);
	if (step1_retVals.errCode != noError) {
		this->failureReason = "Not enough spendables";
		return false;
	}
	// now store step1_retVals for step2
	this->step1_retVals__final_total_wo_fee = step1_retVals.final_total_wo_fee;
	this->step1_retVals__using_fee = step1_retVals.using_fee;
	this->step1_retVals__change_amount = step1_retVals.change_amount;
	this->step1_retVals__mixin = step1_retVals.mixin;
	if (this->step1_retVals__using_outs.size() != 0) {
		this->failureReason = "Expected 0 using_outs";
		return false;
	}
	this->step1_retVals__using_outs = std::move(step1_retVals.using_outs); // move structs from stack's vector to heap's vector
	
	return true;
}
bool FormSubmissionController::cb_II__got_random_outs(const optional<property_tree::ptree> &res) {
	auto parsed_res = new__parsed_res__get_random_outs(res.get());
	if (parsed_res.err_msg != boost::none) {
		this->failureReason = std::move(*(parsed_res.err_msg));
		return false;
	}
	if (parsed_res.err_msg != boost::none) {
		this->failureReason = "Expected non-0 using_outs";
		return false;
	}
	const vector<uint64_t> &sending_amounts = this->parameters.is_sweeping ?
		vector<uint64_t>{*this->step1_retVals__final_total_wo_fee}
 		: this->sending_amounts;
	Send_Step2_RetVals step2_retVals;
	uint64_t unlock_time = 0; // hard-coded for now since we don't ever expose it, presently
	monero_transfer_utils::send_step2__try_create_transaction(
		step2_retVals,
		//
		this->parameters.from_address_string,
		this->parameters.sec_viewKey_string,
		this->parameters.sec_spendKey_string,
		this->to_address_strings,
		boost::none,
		sending_amounts,
		*(this->step1_retVals__change_amount),
		*(this->step1_retVals__using_fee),
		this->parameters.priority,
		this->step1_retVals__using_outs,
		this->fee_per_b,
		this->fee_mask,
		*(parsed_res.mix_outs),
		this->use_fork_rules,
		unlock_time,
		this->parameters.nettype
	);
	if (step2_retVals.errCode != noError) {
		this->failureReason = "No balances";
		return false;
	}
	if (step2_retVals.tx_must_be_reconstructed) {
		// this will update status back to .calculatingFee
		if (this->constructionAttempt > 15) { // just going to avoid an infinite loop here or particularly long stack
			this->failureReason = "Exceeded construction attempts";
			return false;
		}
		this->valsState = WAIT_FOR_STEP1; // must reset this
		//
		this->constructionAttempt += 1; // increment for re-entry
		this->passedIn_attemptAt_fee = step2_retVals.fee_actually_needed; // -> reconstruction attempt's step1's passedIn_attemptAt_fee
		// reset step1 vals for correctness: (otherwise we end up, for example, with duplicate outs added)
		this->step1_retVals__final_total_wo_fee = none;
		this->step1_retVals__change_amount = none;
		this->step1_retVals__using_fee = none;
		this->step1_retVals__mixin = none;
		this->step1_retVals__using_outs.clear(); // critical!
		// and let's reset step2 just for clarity/explicitness, though we don't expect them to have values yet:
		this->step2_retVals__signed_serialized_tx_string = boost::none;
		this->step2_retVals__tx_hash_string = boost::none;
		this->step2_retVals__tx_key_string = boost::none;
		this->step2_retVals__tx_pub_key_string = boost::none;
		//
		_reenterable_construct_and_send_tx();
		return false;
	}
	// move step2 vals onto heap for later:
	this->step2_retVals__signed_serialized_tx_string = *(step2_retVals.signed_serialized_tx_string);
	this->step2_retVals__tx_hash_string = *(step2_retVals.tx_hash_string);
	this->step2_retVals__tx_key_string = *(step2_retVals.tx_key_string);
	this->step2_retVals__tx_pub_key_string = *(step2_retVals.tx_pub_key_string);

	return true;
}

string FormSubmissionController::cb_III__submitted_tx()
{
	// Success_RetVals success_retVals;
	// success_retVals.used_fee = *(this->step1_retVals__using_fee); // NOTE: not the same thing as step2_retVals.fee_actually_needed
	// success_retVals.total_sent = *(this->step1_retVals__final_total_wo_fee) + *(this->step1_retVals__using_fee);
	// success_retVals.mixin = *(this->step1_retVals__mixin);
	// success_retVals.signed_serialized_tx_string = *(this->step2_retVals__signed_serialized_tx_string);
	// success_retVals.tx_hash_string = *(this->step2_retVals__tx_hash_string);
	// success_retVals.tx_key_string = *(this->step2_retVals__tx_key_string);
	// success_retVals.tx_pub_key_string = *(this->step2_retVals__tx_pub_key_string);
	// success_retVals.final_total_wo_fee = *(this->step1_retVals__final_total_wo_fee);
	// success_retVals.isXMRAddressIntegrated = this-isXMRAddressIntegrated;
	// success_retVals.integratedAddressPIDForDisplay = this->integratedAddressPIDForDisplay;
	// XXX success_retVals.target_address = this->to_address_string;

	boost::property_tree::ptree root;
	root.put("used_fee", std::move(RetVals_Transforms::str_from(*(this->step1_retVals__using_fee))));  // NOTE: not the same thing as step2_retVals.fee_actually_needed
	root.put("total_sent", std::move(RetVals_Transforms::str_from(*(this->step1_retVals__final_total_wo_fee) + *(this->step1_retVals__using_fee))));
	root.put("mixin", *(this->step1_retVals__mixin)); // this is a uint32 so it can be sent in JSON
	root.put("serialized_signed_tx", std::move(*(this->step2_retVals__signed_serialized_tx_string)));
	root.put("tx_hash", std::move(*(this->step2_retVals__tx_hash_string)));
	root.put("tx_key", std::move(*(this->step2_retVals__tx_key_string)));
	root.put("tx_pub_key", std::move(*(this->step2_retVals__tx_pub_key_string)));
	root.put("target_address", "XXX fix me"); // XXX
	root.put("final_total_wo_fee", std::move(RetVals_Transforms::str_from(*(this->step1_retVals__final_total_wo_fee))));
	root.put("isXMRAddressIntegrated", std::move(RetVals_Transforms::str_from(this-isXMRAddressIntegrated)));
	if (this->integratedAddressPIDForDisplay) {
		root.put("integratedAddressPIDForDisplay", std::move(*(this->integratedAddressPIDForDisplay)));
	}

	return ret_json_from_root(root).c_str();
}
