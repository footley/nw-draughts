#!/bin/bash
rm -rf resources
mkdir resources
curl http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-linux-x64.tar.gz > resources/node-webkit-v0.9.2-linux-x64.tar.gz
curl http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-win-ia32.zip > resources/node-webkit-v0.9.2-win-ia32.zip
curl http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-osx-ia32.zip > resources/node-webkit-v0.9.2-osx-ia32.zip
cd resources/
tar -xvzf node-webkit-v0.9.2-linux-x64.tar.gz
unzip node-webkit-v0.9.2-win-ia32.zip -d node-webkit-v0.9.2-win-ia32
unzip node-webkit-v0.9.2-osx-ia32.zip -d node-webkit-v0.9.2-osx-ia32

RUN=$1
if (("$#" == 1)); then
    if (("$RUN" == "-libudev")); then
        echo "fix libudev"
        cd node-webkit-v0.9.2-linux-x64/
        sed -i 's/\x75\x64\x65\x76\x2E\x73\x6F\x2E\x30/\x75\x64\x65\x76\x2E\x73\x6F\x2E\x31/g' nw
    fi
fi
