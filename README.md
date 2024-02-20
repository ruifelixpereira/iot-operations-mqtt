# IoT Operations MQTT test

## Get Azure IoT Operations MQTT frontend settings

By default, Azure IoT Operations deploys a default Broker resource named broker. It's deployed in the azure-iot-operations namespace with cardinality and memory profile settings as configured during the initial deployment with Azure portal or Azure CLI. To see the settings, run the following command:

kubectl get broker broker -n azure-iot-operations -o yaml


## K3S authentication to pull images from ACR

### Create Service principal
We need to use a service principal (new or existing one). The service principal needs to have the following roles: acrpull.
    
```bash
script/create_sp.sh
```

If you don't save or remember the service principal password, you can reset it. This command returns a new, valid password for your service principal. 

```bash
az ad sp credential reset  --name http://<service-principal-name> --query password --output tsv
```

### Create an image pull secret

```bash
kubectl create secret docker-registry acr-secret \
    --namespace <namespace> \
    --docker-server=<container-registry-name>.azurecr.io \
    --docker-username=<service-principal-ID> \
    --docker-password=<service-principal-password>
```


## Deploy

```bash
kubectl apply -f pod.yaml
```

k logs mqtt-client-nodejs -n azure-iot-operations --follow


## Attach

kubectl exec --stdin --tty mqtt-client-nodejs -n azure-iot-operations -- sh

## Test with other clients

kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh

mosquitto_sub -h aio-mq-dmqtt-frontend -p 8883 -t "azure-iot-operations/data/opc.tcp/opc.tcp-1/thermostat" -u '$sat' -P $(cat /var/run/secrets/tokens/mq-sat) -d --cafile /var/run/certs/ca.crt

mqttui -b mqtts://aio-mq-dmqtt-frontend:8883 -u '$sat' --password $(cat /var/run/secrets/tokens/mq-sat) --insecure

## Test wityh boiler topic

azure-iot-operations/data/opc.tcp/opc.tcp-1/boiler-1-c46fdde37f577b9ab0cd7b90b89d2a4e