#!/bin/bash

IMAGE_NAME="mqtt-subscriber"
IMAGE_VERSION="0.1.6"

cd ..

docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} .
docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${IMAGE_NAME}:latest
