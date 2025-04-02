#!/bin/bash

echo "🚀 Updating system packages..."
sudo apt update && sudo apt install -y cmake ninja-build

echo "🔹 Cloning liboqs..."
git clone --recursive https://github.com/open-quantum-safe/liboqs.git
cd liboqs
mkdir build && cd build
cmake -GNinja .. -DOQS_USE_OPENSSL=OFF
ninja
sudo ninja install

echo "📦 Installing Node.js dependencies..."
cd ../../
npm install

echo "✅ Build completed successfully!"
