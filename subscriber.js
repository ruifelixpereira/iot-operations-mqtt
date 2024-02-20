const mqtt = require('mqtt')
const fs = require('fs');

const host = process.env.IOT_MQ_HOST_NAME
const port = process.env.IOT_MQ_PORT
const tls_enabled = (process.env.IOT_MQ_TLS_ENABLED === "true")

const clientId = `mqtt_iot_client_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtts://${host}:${port}`


// Read SAT Token
const token_path = "/var/run/secrets/tokens/mq-sat";

let satToken = "";
try {
  satToken = fs.readFileSync(token_path, 'utf8');
  console.log(satToken);
} catch (err) {
  console.error(err);
}

// Read trust CA list. The CA list will be used to determine if server is authorized
let caCerts = "";                                                        
try {                                                                    
  caCerts = fs.readFileSync("/var/run/certs/ca.crt", 'utf8');            
  //console.log(caCerts);                                               
} catch (err) {                                                          
  console.error(err);                                        
} 

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "$sat",
  password: satToken,
  reconnectPeriod: 1000,
  protocolVersion: 5,
  ca: caCerts,
})

const topic = process.env.IOT_MQ_TOPIC

client.on('connect', (error) => {

  if (error) {
    console.error(error)
  }

  console.log('Connected')

  client.subscribe([topic], (error) => {

    if (error) {
      console.error(error)
    }

    console.log(`Subscribe to topic '${topic}'`)
    
    /*
    client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
    */
  })
})


client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})

