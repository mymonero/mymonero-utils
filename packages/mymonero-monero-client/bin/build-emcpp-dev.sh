#!/bin/sh

#EMCC_DEBUG=1 

mkdir -p build && 
cd build && 
emcmake cmake .. -DMM_DEBUG=1 && 
emmake cmake --build . && 
emmake make .