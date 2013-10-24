#!/usr/bin/env bash

browserify main.js > static/bundle.js
node server.js
