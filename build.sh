#!/bin/bash

# Update packages
apt update && apt install -y cmake ninja-build libssl-dev unzip xsltproc doxygen graphviz python3-yaml valgrind

# Clone and build liboqs
rm -rf liboqs
git clone -b main https://github.com/open-quantum-safe/liboqs.git
mkdir -p liboqs/build && cd liboqs/build
cmake -GNinja ..
ninja
cd ../..

# Clone and install liboqs-node
rm -rf liboqs-node
git clone https://github.com/open-quantum-safe/liboqs-node.git
cd liboqs-node
npm install .
cd ..

# Install Node.js dependencies
npm install
