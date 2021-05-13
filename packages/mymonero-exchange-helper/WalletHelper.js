function SendFunds (wallet, xmr_amount, xmr_send_address, sweep_wallet, validation_status_fn, handle_response_fn, context) {
    if (context.walletsListController.orderSent == true) {
      console.log('Duplicate order')
    } else {
      try {
        return new Promise((resolve, reject) => {
          context.walletsListController.orderSent = true

          const enteredAddressValue = xmr_send_address // ;
          const resolvedAddress = ''
          const manuallyEnteredPaymentID = ''
          const resolvedPaymentID = ''
          const hasPickedAContact = false
          const manuallyEnteredPaymentID_fieldIsVisible = false
          const resolvedPaymentID_fieldIsVisible = false
          const resolvedAddress_fieldIsVisible = false
          let contact_payment_id
          let cached_OAResolved_address
          let contact_hasOpenAliasAddress
          let contact_address
          const raw_amount_string = xmr_amount // XMR amount in double
          const sweeping = sweep_wallet
          const simple_priority = 1

          wallet.SendFunds(
            enteredAddressValue,
            resolvedAddress,
            manuallyEnteredPaymentID,
            resolvedPaymentID,
            hasPickedAContact,
            resolvedAddress_fieldIsVisible,
            manuallyEnteredPaymentID_fieldIsVisible,
            resolvedPaymentID_fieldIsVisible,
            contact_payment_id,
            cached_OAResolved_address,
            contact_hasOpenAliasAddress,
            contact_address,
            raw_amount_string,
            sweeping,
            simple_priority,
            validation_status_fn,
            cancelled_fn,
            handle_response_fn
          )
        })
      } catch (error) {
        context.walletsListController.orderSent = false
        console.log(error)
      }
    }
  } // end of function

let WalletHelper = { SendFunds }
module.exports = WalletHelper