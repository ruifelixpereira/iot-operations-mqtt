FROM node:18.12.1-alpine3.17

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

#USER node

RUN npm install

#COPY --chown=node:node . .
COPY . .

CMD [ "node", "subscriber.js" ]