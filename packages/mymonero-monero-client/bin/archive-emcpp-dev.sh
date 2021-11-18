#!/bin/sh

bin/build-emcpp-dev.sh &&
cp build/MyMoneroClient_WASM.js src/; 
cp build/MyMoneroClient_WASM.wasm src/;
cp build/MyMoneroClient_WASM.wasm.map src/;