#!/bin/bash

# Array of directories containing Node.js projects
directories=(
    "mymonero-bigint"
    "mymonero-nettype"
    "mymonero-keyimage-cache"
    "mymonero-app-bridge"
    "mymonero-money-format"
    "mymonero-cryptor"
    "mymonero-web-components"
    "mymonero-openalias"
    "mymonero-page-templates"
    "mymonero-monero-config"
    "mymonero-libapp"
    "mymonero-exchange"
    "mymonero-locales"
    "mymonero-tx-parsing-utils"
    "mymonero-monero-client"
    "mymonero-bridge-utils"
    "mymonero-net-service-utils"
    "mymonero-response-parser-utils"
    "mymonero-hosted-api"
    "changenow-exchange-integration"
    "mymonero-lws-client"
    "mymonero-paymentid-utils"
    "mymonero-exchange-helper"
    "mymonero-wallet-manager"
    "mymonero-yat-lookup"
    "mymonero-request-utils"
    "mymonero-sendfunds-utils"
)

# Iterate through each directory
for dir in "${directories[@]}"
do
    echo "Processing $dir"
    
    # Change to the directory
    cd "$dir" || { echo "Failed to enter directory $dir"; exit 0; }
    
    # Run npm install if needed
    npm install || { echo "npm install failed in $dir"; exit 1; }
    
    # Run npm build
    npm run build || { echo "npm build failed in $dir"; exit 1; }
    
    # Return to the original directory
    cd - > /dev/null
done

echo "Build process completed for all projects."
