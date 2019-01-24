#!/bin/sh

cd /home/ec2-user/ireversi
npm i
npm run ps:stop
npm run deploy
