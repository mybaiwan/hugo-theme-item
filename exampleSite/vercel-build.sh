#!/bin/bash

# default versions
NODE_VERSION='20.17.0';
GO_VERSION='1.22.5';
HUGO_VERSION='0.130.0';

# install Node.js
# echo "Installing Node.js $NODE_VERSION..."
# curl -sSOL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.gz
# tar -xzf node-v${NODE_VERSION}.tar.gz
# export PATH=$PATH:/usr/local/bin
# rm -rf node-v${NODE_VERSION}.tar.gz

echo "USING NODE VERSION: $(node -v)"

# install Go
echo "Installing Go $GO_VERSION..."
curl -sSOL https://dl.google.com/go/go${GO_VERSION}.linux-amd64.tar.gz
tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
rm -rf go${GO_VERSION}.linux-amd64.tar.gz
go version

# install Hugo
echo "Installing Hugo $HUGO_VERSION..."
curl -sSOL https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
tar -xzf hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
mv hugo /usr/local/bin/
rm -rf hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz
hugo version

# install dependencies
echo "Installing project dependencies..."
npm install -g postcss-cli
npm install -g autoprefixer
cd themes/hugo-theme-item
npm install

# init
echo "Initialize Hugo modules..."
npm run init

# run the build command
echo "Running the build command..."
cd ../..
hugo --gc --minify --templateMetrics --templateMetricsHints --forceSyncStatic