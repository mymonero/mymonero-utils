#!/bin/sh

bin/build-emcpp.sh &&
cp build/MyMoneroClient_WASM.js src/; 
cp build/MyMoneroClient_WASM.wasm src/;