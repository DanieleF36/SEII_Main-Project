#!/bin/bash

cd ./server
npx nodemon index.js &

cd ../client
npm run dev