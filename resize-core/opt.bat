@echo off
set WASM_INPUT=./pkg/resizer_core_bg.wasm
set WASM_OUTPUT=./pkg/resizer_core_bg.wasm

wasm-opt --enable-bulk-memory --enable-nontrapping-float-to-int -O %WASM_INPUT% -o %WASM_OUTPUT%
