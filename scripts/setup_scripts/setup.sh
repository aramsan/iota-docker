#!/bin/sh

sudo apt-get remove -y docker docker-engine docker.io containerd runc
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common git vim nodejs npm
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=arm64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-compose
sudo usermod -aG docker ubuntu
sudo ufw disable
cd ~
git clone https://github.com/aramsan/iota-docker.git
echo .
echo .
echo please reboot this instance
echo .
echo sudo reboot

echo "-----How to build the hornet(validator) node-----"
echo .
echo cd hornet
echo docker-compose build
echo dokcer-compose up -d
echo .
echo After few minutis, please restart the container.
echo
echo docker-compose stop
echo dokcer-compose up -d
echo .
echo .
echo "-----How to build node-----"
echo .
echo cd node
echo docker-compose build
echo dokcer-compose up -d