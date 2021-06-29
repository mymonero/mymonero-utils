function handleOfferError(error) {
    let errorDiv = document.createElement('div');
    errorDiv.classList.add('message-label');
    let errorMessage = "";
    if (typeof(error.response.status) == "undefined") {
        errorMessage = error.message
    } else {
        // We may have a value in error.response.data.Error
        if (typeof(error.response.data) !== "undefined" && typeof(error.response.data.Error !== "undefined")) {
            errorMessage = error.response.data.Error
        } else {
            errorMessage = error.message
        }
    }
    errorDiv.id = 'server-invalid';
    errorDiv.innerHTML = `There was a problem communicating with the server. <br>If this problem keeps occurring, please contact support with a screenshot of the following error: <br>` + errorMessage;
    return errorDiv;
}

module.exports = { handleOfferError }