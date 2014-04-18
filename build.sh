#!/bin/bash
rm output/*
# create checkers.nw
zip -j output/draughts.nw html/* js/* stylesheets/* package.json
# node-webkit
cp resources/node-webkit-v0.9.2-linux-x64/nw output/nw
cp resources/node-webkit-v0.9.2-linux-x64/libffmpegsumo.so output/libffmpegsumo.so
cp resources/node-webkit-v0.9.2-linux-x64/nw.pak output/nw.pak

RUN=$1
if (("$#" == 1)); then
    if (("$RUN" == "-r")); then
        ./output/nw output/draughts.nw
    fi
fi