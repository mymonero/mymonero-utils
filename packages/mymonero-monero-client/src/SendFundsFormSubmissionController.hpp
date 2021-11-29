//
//  SendFundsFormSubmissionController.hpp
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

#ifndef SendFundsFormSubmissionController_hpp
#define SendFundsFormSubmissionController_hpp

#include <string>
#include <memory>
#include <boost/optional/optional.hpp>
#include <boost/locale.hpp>
#include "cryptonote_config.h"
#include "monero_send_routine.hpp"
#include "monero_fork_rules.hpp"

namespace SendFunds
{
	using namespace std;
	using namespace boost;
	using namespace boost::locale;
	using namespace cryptonote;
	using namespace monero_send_routine;
	using namespace monero_transfer_utils;
	//
	// Accessory Types
	enum ProcessStep
	{
		none = 0,
		initiatingSend = 1, // look at isSweeping for whether or not to display amount sent in message
		fetchingLatestBalance = 2,
		calculatingFee = 3,
		fetchingDecoyOutputs = 4,
		constructingTransaction = 5, // may go back to .calculatingFee
		submittingTransaction = 6
	};
	enum PreSuccessTerminalCode
	{
		msgProvided = 0, // use the optional provided string
		unableToLoadWallet = 1,
		unableToLogIntoWallet = 2,
		walletMustBeImported = 3,
		pleaseSpecifyRecipient = 4,
		couldntResolveThisOAAddress = 5,
		couldntValidateDestAddress = 6,
		enterValidPID = 7,
		couldntConstructIntAddrWithShortPid = 8,
		amountTooLow = 9,
		cannotParseAmount = 10,
		errInServerResponse_withMsg = 11,
		createTransactionCode_balancesProvided = 12,
		createTranasctionCode_noBalances = 13,
		exceededConstructionAttempts = 14, // unable to construct for unknown reason
		//
		codeFault_manualPaymentID_while_hasPickedAContact = 99900,
		codeFault_unableToFindResolvedAddrOnOAContact = 99901,
		codeFault_detectedPIDVisibleWhileManualInputVisible = 99902,
		codeFault_invalidSecViewKey = 99903, // considered a code fault since wallet should have validated
		codeFault_invalidSecSpendKey = 99904, // considered a code fault since wallet should have validated
		codeFault_invalidPubSpendKey = 99905, // considered a code fault since wallet should have validated
	};
	enum _Send_Task_ValsState
	{
		WAIT_FOR_HANDLE,
		WAIT_FOR_STEP1,
		WAIT_FOR_STEP2,
		WAIT_FOR_FINISH
	};
	struct Success_RetVals
	{
		string target_address; // this may differ from enteredAddress.. e.g. std addr + short pid -> int addr
		uint64_t used_fee;
		uint64_t final_total_wo_fee;
		uint64_t total_sent; // final_total_wo_fee + final_fee
		size_t mixin;
		bool isXMRAddressIntegrated; // regarding sentTo_address
		optional<string> integratedAddressPIDForDisplay;
		string signed_serialized_tx_string;
		string tx_hash_string;
		string tx_key_string; // this includes additional_tx_keys
		string tx_pub_key_string; // from get_tx_pub_key_from_extra()
	};
	struct Parameters
	{
		vector<string> send_amount_strings;
		bool is_sweeping;
		uint32_t priority;
		//
		network_type nettype;
		string from_address_string;
		string sec_viewKey_string;
		string sec_spendKey_string;
		string pub_spendKey_string;
		//
		vector<string> enteredAddressValues;
		//
		property_tree::ptree unspentOuts;
	};
	//
	// Controllers
	class FormSubmissionController
	{
	public:
		//
		// Lifecycle - Init
		FormSubmissionController(Parameters parameters)
		{
			this->parameters = parameters;
			this->valsState = WAIT_FOR_HANDLE;
		}
		//
		// Constructor args
		Parameters parameters;
		//
		// Remaining initialization args
		std::function<void(void)> get_unspent_outs;
		std::function<void(void)> get_random_outs;
		std::function<void(LightwalletAPI_Req_SubmitRawTx req_params)> submit_raw_tx;
		std::function<void(void)> authenticate_fn;
		//
		// Imperatives - Runtime
		string handle(const property_tree::ptree res);
		string prepare();
		// void cb__authentication(bool did_pass/*false means canceled*/);
		bool cb_I__got_unspent_outs(const optional<property_tree::ptree> &res);
		bool cb_II__got_random_outs(const optional<property_tree::ptree> &res);
		string cb_III__submitted_tx();
	private:
		//
		// Properties - Instance members
		// - state
		_Send_Task_ValsState valsState;
		string failureReason;
		// - from setup
		property_tree::ptree randomOuts;
		vector<uint64_t> sending_amounts;
 		vector<string> to_address_strings;
		bool isXMRAddressIntegrated;
		optional<string> integratedAddressPIDForDisplay;
		// - from cb_i
		vector<SpendableOutput> unspent_outs;
		uint64_t fee_per_b;
		uint64_t fee_mask;
		monero_fork_rules::use_fork_rules_fn_type use_fork_rules;
		// - re-entry params
		optional<uint64_t> passedIn_attemptAt_fee;
		size_t constructionAttempt;
		// - step1_retVals held for step2 - making them optl for increased safety
		optional<uint64_t> step1_retVals__final_total_wo_fee;
		optional<uint64_t> step1_retVals__change_amount;
		optional<uint64_t> step1_retVals__using_fee;
		optional<uint32_t> step1_retVals__mixin;
		vector<SpendableOutput> step1_retVals__using_outs;
		// - step2_retVals held for submit tx - optl for increased safety
		optional<string> step2_retVals__signed_serialized_tx_string;
		optional<string> step2_retVals__tx_hash_string;
		optional<string> step2_retVals__tx_key_string;
		optional<string> step2_retVals__tx_pub_key_string;
		//
		// Imperatives
		void _proceedTo_authOrSendTransaction();
		bool _reenterable_construct_and_send_tx();
	};
}

#endif /* SendFundsFormSubmissionController_hpp */
