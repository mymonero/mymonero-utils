function handleOfferError(error) {
    let errorDiv = document.createElement('div');
    errorDiv.style.clear = "left";
    errorDiv.style.fontFamily = "Native-Light, input, menlo, monospace"
    errorDiv.style.textAlign = "left";
    errorDiv.style.paddingTop = "12px";
    errorDiv.style.fontSize = "11px";
    errorDiv.classList.add('message-label');
    let errorMessage = "";
    
    if (typeof(error.response) == "undefined") { // Handle generic errors
        errorMessage = error.message
    } else if (typeof(error.response.data) !== "undefined" && typeof(error.response.data.Error !== "undefined")) { // Handle axios errors
        errorMessage = error.response.data.Error
    } else { // 
        errorMessage = error.message
    }
    
    errorDiv.id = 'server-invalid';
    errorDiv.innerHTML = `An error was encountered. <br>If this problem keeps occurring, please contact support with a screenshot of the following error: <br>` + errorMessage;
    return errorDiv;
}

module.exports = { handleOfferError }