#!/bin/bash
npx terser VanillePlugin.js --compress --mangle --source-map "url='VanillePlugin.min.js.map'" -o VanillePlugin.min.js