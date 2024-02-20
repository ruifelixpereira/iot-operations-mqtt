#!/bin/bash

IMAGE_NAME="mqtt-subscriber"
IMAGE_VERSION="0.1.6"
ACR_NAME="iot04"

cd ..

#az acr login --name ${ACR_NAME}

docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_VERSION}
docker push ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_VERSION}