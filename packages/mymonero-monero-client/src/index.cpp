//
//  index.cpp
//  Copyright (c) 2014-2019, MyMonero.com
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

#include <stdio.h>
#include <emscripten/bind.h>
#include <emscripten.h>

#include "serial_bridge_index.hpp"
#include "emscr_SendFunds_bridge.hpp"

std::string getExceptionMessage(intptr_t exceptionPtr) {
  return std::string(reinterpret_cast<std::exception *>(exceptionPtr)->what());
}

EMSCRIPTEN_BINDINGS(my_module)
{ // C++ -> JS 
    emscripten::function("getExceptionMessage", &getExceptionMessage);
    emscripten::function("decodeAddress", &serial_bridge::decode_address);
    emscripten::function("isSubaddress", &serial_bridge::is_subaddress);
    emscripten::function("isIntegratedAddress", &serial_bridge::is_integrated_address);

    emscripten::function("newIntegratedAddress", &serial_bridge::new_integrated_address);
    emscripten::function("generatePaymentId", &serial_bridge::new_payment_id);

    emscripten::function("generateWallet", &serial_bridge::newly_created_wallet);
    emscripten::function("compareMnemonics", &serial_bridge::are_equal_mnemonics);
    emscripten::function("mnemonicFromSeed", &serial_bridge::mnemonic_from_seed);
    emscripten::function("seedAndKeysFromMnemonic", &serial_bridge::seed_and_keys_from_mnemonic);
    emscripten::function("isValidKeys", &serial_bridge::validate_components_for_login);
    emscripten::function("addressAndKeysFromSeed", &serial_bridge::address_and_keys_from_seed);

    emscripten::function("estimateTxFee", &serial_bridge::estimated_tx_network_fee);

    emscripten::function("generateKeyImage", &serial_bridge::generate_key_image);
    emscripten::function("prepareTx", emscr_SendFunds_bridge::prepare_send);
    emscripten::function("createAndSignTx", &emscr_SendFunds_bridge::send_funds);
}
extern "C"
{ // C -> JS
}
int main() {
  // printf("hello, world!\n");
  return 0;
}
