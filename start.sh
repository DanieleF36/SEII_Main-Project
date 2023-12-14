#!/bin/bash
HOSTIP=$(ping -c 1 host.docker.internal | head -n 1 | cut -d ' ' -f 3)
echo "HOSTIP=$HOSTIP" > docker.env

cd ./server
npx nodemon index.js &

cd ../client
npm run dev