FROM node:12.19-buster

RUN mkdir /backend
WORKDIR /backend
ADD package.json /backend/
RUN npm i -g ts-node
CMD ts-node orchestrator.ts